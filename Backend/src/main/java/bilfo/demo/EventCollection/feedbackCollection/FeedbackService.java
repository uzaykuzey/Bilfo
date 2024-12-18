package bilfo.demo.EventCollection.feedbackCollection;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Optional<Feedback> createFeedback(int rating, String experience, String recommendation) {
        Feedback feedback = new Feedback(new ObjectId(), rating, experience, recommendation);
        feedbackRepository.save(feedback);
        return Optional.of(feedback);
    }

    public Optional<Feedback> findFeedbackById(ObjectId id) {
        return feedbackRepository.findById(id);
    }
}
