package bilfo.demo.EventCollection;

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
public class Event {
    @Id
    private ObjectId id;
    private ObjectId originalForm;
    private ObjectId[] guides;
    private ObjectId[] trainees;
    private EVENT_TYPES eventType;
    private Date date;
    private TOUR_TIMES time;
}