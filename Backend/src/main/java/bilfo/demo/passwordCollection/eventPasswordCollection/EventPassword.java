package bilfo.demo.passwordCollection.eventPasswordCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "event_passwords")
@AllArgsConstructor
@NoArgsConstructor
public class EventPassword {
    @Indexed(unique = true)
    private ObjectId eventId;
    private String hashedPassword;
}