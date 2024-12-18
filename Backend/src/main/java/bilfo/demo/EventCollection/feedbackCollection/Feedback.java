package bilfo.demo.EventCollection.feedbackCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "feedbacks")
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
    @Id
    private ObjectId id;

    private int rate;
    private String experience;
    private String recommendations;
}