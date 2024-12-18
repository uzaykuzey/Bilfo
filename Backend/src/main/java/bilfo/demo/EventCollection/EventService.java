package bilfo.demo.EventCollection;

import bilfo.demo.EventCollection.feedbackCollection.Feedback;
import bilfo.demo.EventCollection.feedbackCollection.FeedbackService;
import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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

    public boolean claimEvent(int bilkentId, ObjectId eventId, boolean claim) {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (!optionalUser.isPresent() || !optionalEvent.isPresent()) {
            return false;
        }

        User user = optionalUser.get();
        Event event = optionalEvent.get();

        Optional<Form> optionalForm = formService.getForm(eventId);
        if (!optionalForm.isPresent()) {
            return false;
        }

        Form form = optionalForm.get();
        if (form.getApproved() == FORM_STATES.REJECTED || form.getApproved() == FORM_STATES.NOT_REVIEWED) {
            return false;
        }

        return user.isTrainee() ? claimEventTrainee(user, event, form, claim) : claimEventGuide(user, event, form, claim);
    }

    private boolean claimEventGuide(User user, Event event, Form form, boolean claim) {
        int guideCount = Integer.MAX_VALUE;
        if (form.getType() != EVENT_TYPES.FAIR) {
            guideCount = ((TourForm) form).getVisitorCount() / 50;
        }

        if (event.getGuides().size() > guideCount) {
            return false;
        }

        if (claim) {
            event.getGuides().add(user.getBilkentId());
            eventRepository.save(event);
        } else {
            user.getSuggestedEvents().add(event.getId());
            userService.saveUser(user);
        }

        return true;
    }

    private boolean claimEventTrainee(User user, Event event, Form form, boolean claim) {
        int traineeCount = 5;
        if (event.getTrainees().size() > traineeCount) {
            return false;
        }

        if (claim) {
            event.getTrainees().add(user.getBilkentId());
            eventRepository.save(event);
        } else {
            user.getSuggestedEvents().add(event.getId());
            userService.saveUser(user);
        }
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

    public String[] getScheduleOfWeek(int bilkentId, Date startDate)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return null;
        }
        User user = optionalUser.get();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        calendar.add(Calendar.DAY_OF_YEAR, 7);
        Date endDate = calendar.getTime();

        List<Event> events = getEventsBetween(startDate, endDate);
        String[] schedule = new String[User.AVAILABILITY_LENGTH];
        Arrays.fill(schedule, "");

        for(Event event: events)
        {
            if(!event.getGuides().contains(user.getBilkentId()) && !event.getTrainees().contains(user.getBilkentId()))
            {
                continue;
            }
            int daysDifference = (int) ChronoUnit.DAYS.between(startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), event.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
            int[] indexOfTourTime = getIndexOfTourTimes(event.getTime());
            if(indexOfTourTime == null)
            {
                continue;
            }

            if(event.getEventType()==EVENT_TYPES.FAIR)
            {
                for(int i=0;i<9;i++)
                {
                    schedule[daysDifference+i*7] = eventToString(event);
                }
            }
            else
            {
                for(int i: indexOfTourTime)
                {
                    schedule[daysDifference+i*7] = eventToString(event);
                }
            }

        }
        return schedule;
    }

    private List<Event> getEventsBetween(Date startDate, Date endDate)
    {
        List<Event> events = eventRepository.findAll();
        List<Event> result = new ArrayList<>();
        for(Event event: events)
        {
            if(event.getDate().before(endDate) && event.getDate().after(startDate) && event.getState() != EVENT_STATES.CANCELLED)
            {
                result.add(event);
            }
        }
        return result;
    }

    private static int[] getIndexOfTourTimes(TOUR_TIMES time)
    {
        return switch (time)
        {
            case NINE_AM -> new int[]{0, 1, 2};
            case ELEVEN_AM -> new int[]{2, 3, 4};
            case ONE_THIRTY_PM -> new int[]{4, 5, 6};
            case FOUR_PM -> new int[]{6, 7, 8};
            default -> null;
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
            default -> "";
        };
    }
}

