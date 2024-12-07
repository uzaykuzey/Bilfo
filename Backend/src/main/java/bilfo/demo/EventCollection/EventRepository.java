package bilfo.demo.EventCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface EventRepository extends MongoRepository<Event, ObjectId> {
    public Optional<Event> findEventById(ObjectId id);
}