package bilfo.demo.passwordCollection.eventPasswordCollection;

import bilfo.demo.schoolCollection.School;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface EventPasswordRepository extends MongoRepository<EventPassword, ObjectId> {
    public Optional<EventPassword> findByEventId(ObjectId eventId);
}
