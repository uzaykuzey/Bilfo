package bilfo.demo.EventCollection;


import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
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

    public List<Event> allEvents(){
        return eventRepository.findAll();
    }

    public Optional<Event> getEvent(ObjectId id){
        return eventRepository.findById(id);
    }

    public Optional<Event> createEvent(ObjectId originalForm, int[] guides, int[] trainees, EVENT_TYPES eventType, Date date, TOUR_TIMES time) {
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
}
