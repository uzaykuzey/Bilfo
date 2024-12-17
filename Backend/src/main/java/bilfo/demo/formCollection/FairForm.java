package bilfo.demo.formCollection;

import bilfo.demo.enums.CITIES;
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
@TypeAlias("fairForm")
public class FairForm extends Form {
    private CITIES location;
    private String schoolName;

    public FairForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, String contactMail, CITIES location, String schoolName) {
        super(id, approved, possibleTimes, EVENT_TYPES.FAIR, contactMail);
        this.location = location;
        this.schoolName = schoolName;
    }
}