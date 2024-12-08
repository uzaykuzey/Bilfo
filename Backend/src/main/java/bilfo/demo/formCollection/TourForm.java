package bilfo.demo.formCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;

public class TourForm extends Form {
    private int visitorCount;
    private String visitorNotes;

    public TourForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, int visitorCount, String visitorNotes, EVENT_TYPES type) {
        super(id, approved, possibleTimes, type);
        this.visitorCount = visitorCount;
        this.visitorNotes = visitorNotes;
    }
}
