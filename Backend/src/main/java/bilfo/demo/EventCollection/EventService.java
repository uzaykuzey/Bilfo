package bilfo.demo.EventCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormService;
import bilfo.demo.formCollection.TourForm;
import bilfo.demo.mailSender.MailSenderService;
import bilfo.demo.passwordCollection.eventPasswordCollection.EventPassword;
import bilfo.demo.passwordCollection.eventPasswordCollection.EventPasswordService;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserManager;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


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

    public List<Event> allEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEvent(ObjectId id) {
        return eventRepository.findById(id);
    }

    public Optional<Event> createEvent(ObjectId originalForm, List<Integer> guides, List<Integer> trainees, EVENT_TYPES eventType, Date date, TOUR_TIMES time) {
        Event event = new Event(new ObjectId(), originalForm, guides, trainees, eventType, date, time, -1, "", "");

        String password = UserManager.generatePassword(8);

        EventPassword eventPassword = new EventPassword(event.getId(), passwordEncoder.encode(password));

        Optional<Form> optionalForm = formService.getForm(originalForm);

        if(optionalForm.isEmpty()) {
            return Optional.empty();
        }

        Form form = optionalForm.get();


        mailSenderService.sendEmail(form.getContactMail(), "Bilkent Event Feedback", "After the event is completed, you can give your feedback by using code:\n"+password);

        Event savedEvent = eventRepository.save(event);
        eventPasswordService.saveEventPassword(eventPassword);
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

    private List<Event> findByEventsContactMail(String email)
    {
        List<Event> allEvents = eventRepository.findAll();
        List<Event> result=new ArrayList<>();

        for(Event e:allEvents)
        {
            Optional<Form> optionalForm = formService.getForm(e.getOriginalForm());
            if(optionalForm.isPresent() && optionalForm.get().getContactMail().equals(email))
            {
                result.add(e);
            }
        }
        return result;
    }

    public boolean sendFeedback(String email, String password, int rating, String experience, String recommendations)
    {
        List<Event> eventsWithContactMail = findByEventsContactMail(email);

        for(Event e:eventsWithContactMail)
        {
            if(e.getDate().after(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant())))
            {
                continue;
            }
            Optional<EventPassword> optionalEventPassword = eventPasswordService.getEventPasswordWithEventId(e.getId());
            if(optionalEventPassword.isEmpty())
            {
                continue;
            }
            if(passwordEncoder.matches(password, optionalEventPassword.get().getHashedPassword()))
            {
                e.setRate(rating);
                e.setExperience(experience);
                e.setRecommendations(recommendations);
                eventRepository.save(e);
                return true;
            }
        }
        return false;
    }
}

