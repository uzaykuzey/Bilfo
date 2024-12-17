package bilfo.demo.logCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "events")
@AllArgsConstructor
@NoArgsConstructor
public class Log {
    @Id
    private ObjectId id;
    private double hours;
    private ObjectId eventId;
    private boolean paid;
}