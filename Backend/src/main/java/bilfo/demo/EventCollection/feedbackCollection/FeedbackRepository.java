package bilfo.demo.EventCollection.feedbackCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

@RestController
@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, ObjectId> {
    public Optional<Feedback> findFeedbackById(ObjectId id);
}