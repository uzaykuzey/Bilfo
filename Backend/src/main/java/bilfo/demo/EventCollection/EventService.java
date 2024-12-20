package bilfo.demo.EventCollection;

import bilfo.demo.EventCollection.feedbackCollection.Feedback;
import bilfo.demo.EventCollection.feedbackCollection.FeedbackService;
import bilfo.demo.enums.*;
import bilfo.demo.formCollection.*;
import bilfo.demo.mailSender.MailSenderService;
import bilfo.demo.passwordCollection.eventPasswordCollection.EventPassword;
import bilfo.demo.passwordCollection.eventPasswordCollection.EventPasswordService;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserManager;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.util.Pair;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;


@Service
public class EventService {

    @Autowired
    private UserService userService;

    @Autowired
    @Lazy
    private FormService formService;

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private EventPasswordService eventPasswordService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MailSenderService mailSenderService;
    @Autowired
    private FeedbackService feedbackService;

    public List<Event> allEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEvent(ObjectId id) {
        return eventRepository.findById(id);
    }

    public Optional<Event> createEvent(ObjectId originalForm, List<Integer> guides, List<Integer> trainees, EVENT_TYPES eventType, Date date, TOUR_TIMES time) {
        Event event = new Event(new ObjectId(), originalForm, guides, trainees, eventType, date, time, EVENT_STATES.ONGOING, null);

        Event savedEvent = eventRepository.save(event);
        return Optional.of(savedEvent);
    }

    public boolean claimEvent(int bilkentId, ObjectId formId, boolean voluntary) {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        Optional<Event> optionalEvent = eventRepository.findEventByOriginalForm(formId);
        if (optionalUser.isEmpty() || optionalEvent.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        Event event = optionalEvent.get();

        Optional<Form> optionalForm = formService.getForm(formId);
        if (optionalForm.isEmpty()) {
            return false;
        }

        Form form = optionalForm.get();
        if (form.getApproved() == FORM_STATES.REJECTED || form.getApproved() == FORM_STATES.NOT_REVIEWED) {
            return false;
        }

        if(!isUserAvailable(user, event.getDate(), event.getTime(), !voluntary))
        {
            return false;
        }

        return user.isTrainee() ? claimEventTrainee(user, event, form, voluntary) : claimEventGuide(user, event, form, voluntary);
    }

    private boolean claimEventGuide(User user, Event event, Form form, boolean voluntary) {
        int guideCount = Integer.MAX_VALUE;
        if (form.getType() != EVENT_TYPES.FAIR) {
            guideCount = ((TourForm) form).getVisitorCount() / 50;
        }

        if (event.getGuides().size() > guideCount) {
            return false;
        }

        if (voluntary) {
            user.getSuggestedEvents().remove(event.getId());
            event.getGuides().add(user.getBilkentId());
            eventRepository.save(event);
        } else {
            user.getSuggestedEvents().add(event.getId());
        }
        userService.saveUser(user);

        return true;
    }

    private boolean claimEventTrainee(User user, Event event, Form form, boolean voluntary) {
        int traineeCount = 5;
        if (event.getTrainees().size() > traineeCount) {
            return false;
        }

        if (voluntary) {
            user.getSuggestedEvents().remove(event.getId());
            event.getTrainees().add(user.getBilkentId());
            eventRepository.save(event);
        } else {
            user.getSuggestedEvents().add(event.getId());
        }
        userService.saveUser(user);
        return true;
    }


    public boolean sendFeedback(String email, String password, int rating, String experience, String recommendations)
    {
        List<EventPassword> eventPasswords = eventPasswordService.getEventPasswordsByContactMail(email);

        for(EventPassword eventPassword:eventPasswords)
        {
            if(passwordEncoder.matches(password, eventPassword.getHashedPassword()))
            {
                Optional<Event> event = eventRepository.findById(eventPassword.getEventId());
                if(event.isEmpty())
                {
                    continue;
                }
                Optional<Feedback> feedback=feedbackService.createFeedback(rating, experience, recommendations);
                if(feedback.isEmpty())
                {
                    continue;
                }
                event.get().setFeedback(feedback.get().getId());
                eventRepository.save(event.get());
                eventPasswordService.deleteEventPassword(eventPassword);
                return true;
            }
        }
        return false;
    }

    public Optional<Feedback> getFeedback(ObjectId eventId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if(optionalEvent.isEmpty())
        {
            return Optional.empty();
        }
        return feedbackService.findFeedbackById(optionalEvent.get().getFeedback());
    }

    @Scheduled(fixedRate = 30000)
    private void checkCompletedEvents()
    {
        List<Event> events = eventRepository.findEventsByState(EVENT_STATES.ONGOING);
        for(Event event: events)
        {
            if(event.getDate().before(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant())))
            {
                event.setState(EVENT_STATES.COMPLETED);
                Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
                if(optionalForm.isEmpty()) {
                    continue;
                }
                Form form = optionalForm.get();
                String password = UserManager.generatePassword(16);
                EventPassword eventPassword = new EventPassword(new ObjectId(), event.getId(), form.getContactMail(), passwordEncoder.encode(password));
                mailSenderService.sendEmail(form.getContactMail(), "Bilkent Event Feedback", "Your event has been completed, you can give your feedback by using code:\n"+password);
                eventRepository.save(event);
                eventPasswordService.saveEventPassword(eventPassword);
            }
        }
    }

    public String[] getScheduleOfWeek(int bilkentId, String startDateString)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return null;
        }
        User user = optionalUser.get();

        Date startDate = FormManager.stringToDate(startDateString);
        if(startDate==null)
        {
            return null;
        }

        return getScheduleOfWeek(user, startDate);
    }

    private String[] getScheduleOfWeek(User user, Date startDate)
    {
        Date endDate = DAY.add(startDate, 7);

        List<Event> events = eventRepository.findEventsByDateBetween(startDate, endDate);
        String[] schedule = new String[User.AVAILABILITY_LENGTH];
        Arrays.fill(schedule, "");

        for(Event event: events)
        {
            if(event.getState() == EVENT_STATES.CANCELLED || (!event.getGuides().contains(user.getBilkentId()) && !event.getTrainees().contains(user.getBilkentId())))
            {
                continue;
            }
            int[] indexOfTourTime = getIndexOfTourTimes(event.getTime());
            int daysDifference = DAY.dayDifference(startDate, event.getDate());

            String eventString = eventToString(event);
            for(int i: indexOfTourTime)
            {
                schedule[daysDifference+i*7] = eventString;
            }


        }
        return schedule;
    }


    private static int[] getIndexOfTourTimes(TOUR_TIMES time)
    {
        return switch (time)
        {
            case NINE_AM -> new int[]{0, 1, 2};
            case ELEVEN_AM -> new int[]{2, 3, 4};
            case ONE_THIRTY_PM -> new int[]{4, 5, 6};
            case FOUR_PM -> new int[]{6, 7, 8};
            case WHOLE_DAY -> new int[]{0, 1, 2, 3, 4, 5, 6, 7, 8};
        };
    }

    private String eventToString(Event event)
    {
        Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
        if(optionalForm.isEmpty())
        {
            return "";
        }

        Form form = optionalForm.get();

        return switch (form.getType())
        {
            case FAIR -> ((FairForm) form).getSchoolName() + " (Fair)";
            case HIGHSCHOOL_TOUR -> ((HighSchoolTourForm) form).getSchoolName() + " (Tour)";
            case INDIVIDUAL_TOUR -> "Individual Tour";
        };
    }

    public List<Pair<Event, Form>> getEvents(EVENT_TYPES type, EVENT_STATES state)
    {
        List<Event> events = eventRepository.findEventsByEventTypeAndState(type, state);
        events.sort(null);
        List<Pair<Event, Form>> result = new ArrayList<>();
        for(Event event: events)
        {
            Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
            if(optionalForm.isEmpty())
            {
                continue;
            }
            result.add(Pair.of(event, optionalForm.get()));
        }
        return result;
    }

    public List<Pair<Event, Form>> getEvents(EVENT_STATES state)
    {
        List<Event> events = eventRepository.findEventsByState(state);
        events.sort(null);
        List<Pair<Event, Form>> result = new ArrayList<>();
        for(Event event: events)
        {
            Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
            if(optionalForm.isEmpty())
            {
                continue;
            }
            result.add(Pair.of(event, optionalForm.get()));
        }
        return result;
    }

    public List<Pair<Event, Form>> getSuggestedEvents(int bilkentId) {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return null;
        }
        List<Pair<Event, Form>> result = new ArrayList<>();

        for(ObjectId eventId: optionalUser.get().getSuggestedEvents())
        {
            Optional<Event> optionalEvent = eventRepository.findEventById(eventId);
            if(optionalEvent.isEmpty())
            {
                continue;
            }
            Event event = optionalEvent.get();

            Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
            if(optionalForm.isEmpty())
            {
                continue;
            }
            result.add(Pair.of(event, optionalForm.get()));
        }
        return result;
    }

    public boolean hasSuggestedEvents(int bilkentId) {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return false;
        }
        return !optionalUser.get().getSuggestedEvents().isEmpty();
    }

    public boolean isUserAvailable(User user, Date date, TOUR_TIMES time, boolean checkUnavailabilityList)
    {
        Date weekStart=DAY.getStartOfWeek(date);
        int dayIndex = DAY.dayDifference(date, weekStart);
        int[] indexOfTourTimes = getIndexOfTourTimes(time);

        if(checkUnavailabilityList)
        {
            boolean[] availability = user.getAvailability();
            for(int i: indexOfTourTimes)
            {
                if(!availability[dayIndex + i*7])
                {
                    return false;
                }
            }
        }

        String[] tourSchedule = getScheduleOfWeek(user, weekStart);
        for(int i: indexOfTourTimes)
        {
            if(!Objects.equals(tourSchedule[dayIndex + i * 7], ""))
            {
                return false;
            }
        }

        return true;
    }
}

