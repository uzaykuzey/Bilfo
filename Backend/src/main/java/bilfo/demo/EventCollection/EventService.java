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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);
    @Autowired
    private UserService userService;
    @Autowired
    private FormService formService;

    private static EventService instance=null;

    public static EventService getInstance() {
        if(instance==null) {
            System.out.println("New EventService created.");
            instance=new EventService();
        }
        return instance;
    }

    public List<Event> allEvents(){
        return eventRepository.findAll();
    }

    public Optional<Event> getEvent(ObjectId id){
        return eventRepository.findById(id);
    }

    public Optional<Event> createEvent(ObjectId originalForm, List<Integer> guides, List<Integer> trainees, EVENT_TYPES eventType, Date date, TOUR_TIMES time) {
        logger.info("Creating Event");

        // Check if Event already exists
        //TODO
        /*Optional<Event> existingUser = EventRepository.findEventById(id);
        if (existingUser.isPresent()) {
            logger.warn("Event with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        // Create the new Event object
        Event event = new Event(new ObjectId(), originalForm, guides, trainees, eventType, date, time);

        // Save the Event in the database
        Event savedEvent = eventRepository.save(event);
        logger.info("Event with ID {} created successfully.", event.getId());

        return Optional.of(savedEvent);
    }

    public boolean claimEvent(int bilkentId, ObjectId eventId, boolean claim)
    {
        Optional<User> optionalUser=userService.getUser(bilkentId);
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if(!optionalUser.isPresent() || !optionalEvent.isPresent())
        {
            return false;
        }
        User user=optionalUser.get();
        Event event=optionalEvent.get();

        Optional<Form> optionalForm=formService.getForm(eventId);
        if(!optionalForm.isPresent())
        {
            return false;
        }
        Form form=optionalForm.get();
        if(form.getApproved() == FORM_STATES.REJECTED || form.getApproved() == FORM_STATES.NOT_REVIEWED)
        {
            return false;
        }

        return user.isTrainee() ? claimEventTrainee(user, event, form, claim): claimEventGuide(user, event, form, claim);
    }

    private boolean claimEventGuide(User user, Event event, Form form, boolean claim)
    {
        int guideCount=Integer.MAX_VALUE;
        if(form.getType()!=EVENT_TYPES.FAIR)
        {
            guideCount = ((TourForm) form).getVisitorCount()/50;
        }

        if(event.getGuides().size()>guideCount)
        {
            return false;
        }

        if(claim)
        {
            event.getGuides().add(user.getBilkentId());
            eventRepository.save(event);
        }
        else
        {
            user.getSuggestedEvents().add(event.getId());
            userService.saveUser(user);
        }

        return true;
    }

    private boolean claimEventTrainee(User user, Event event, Form form, boolean claim)
    {
        int traineeCount = 5;
        if(event.getTrainees().size()>traineeCount)
        {
            return false;
        }

        if(claim)
        {
            event.getTrainees().add(user.getBilkentId());
            eventRepository.save(event);
        }
        else
        {
            user.getSuggestedEvents().add(event.getId());
            userService.saveUser(user);
        }
        return true;
    }
}
