package bilfo.demo.EventCollection;

import bilfo.demo.ObjectIdSerializer;
import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "events")
@AllArgsConstructor
@NoArgsConstructor
public class Event implements Comparable<Event> {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private ObjectId originalForm;
    private List<Integer> guides;
    private List<Integer> trainees;
    private EVENT_TYPES eventType;
    private Date date;
    private TOUR_TIMES time;
    private EVENT_STATES state;
    private ObjectId feedback;

    @Override
    public int compareTo(Event o) {
        return this.date.compareTo(o.date) == 0 ? this.time.compareTo(o.time) : this.date.compareTo(o.date);
    }
}