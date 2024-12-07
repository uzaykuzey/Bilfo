package bilfo.demo.logCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "events")
@AllArgsConstructor
@NoArgsConstructor
public class Log {
    @Id
    private ObjectId id;
    private int hours;
    private ObjectId eventId;
    private boolean paid;
}