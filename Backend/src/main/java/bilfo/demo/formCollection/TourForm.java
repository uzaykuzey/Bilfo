package bilfo.demo.formCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.util.Pair;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@TypeAlias("tourForm")
public class TourForm extends Form {
    private int visitorCount;
    private String visitorNotes;

    public TourForm(ObjectId id, Date dateOfForm, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, String contactMail, int visitorCount, String visitorNotes, EVENT_TYPES type) {
        super(id, dateOfForm, approved, possibleTimes, type, contactMail);
        this.visitorCount = visitorCount;
        this.visitorNotes = visitorNotes;
    }
}
