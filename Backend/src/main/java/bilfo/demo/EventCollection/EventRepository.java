package bilfo.demo.EventCollection;

import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface EventRepository extends MongoRepository<Event, ObjectId> {
    public Optional<Event> findEventById(ObjectId id);
    public List<Event> findAll();
    public List<Event> findEventsByState(EVENT_STATES state);
    public List<Event> findEventsByEventTypeAndState(EVENT_TYPES eventType, EVENT_STATES state);
    public Optional<Event> findEventByOriginalForm(ObjectId originalFormId);
}