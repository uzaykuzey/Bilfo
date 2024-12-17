package bilfo.demo.EventCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormService;
import bilfo.demo.formCollection.TourForm;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
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

    public List<Event> allEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEvent(ObjectId id) {
        return eventRepository.findById(id);
    }

    public Optional<Event> createEvent(ObjectId originalForm, List<Integer> guides, List<Integer> trainees, EVENT_TYPES eventType, Date date, TOUR_TIMES time) {
        Event event = new Event(new ObjectId(), originalForm, guides, trainees, eventType, date, time);
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
}

