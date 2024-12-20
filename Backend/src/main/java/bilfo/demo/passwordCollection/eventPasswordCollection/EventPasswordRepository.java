package bilfo.demo.passwordCollection.eventPasswordCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface EventPasswordRepository extends MongoRepository<EventPassword, ObjectId> {
    public Optional<EventPassword> findByEventId(ObjectId eventId);
    public void removeById(ObjectId eventId);
    public List<EventPassword> findByContactMail(String contactMail);
}
