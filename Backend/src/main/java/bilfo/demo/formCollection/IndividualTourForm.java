package bilfo.demo.formCollection;

import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;

@TypeAlias("individualTourForm")
public class IndividualTourForm extends TourForm {
    private String[] names;
    private DEPARTMENT department;

    public IndividualTourForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, int visitorCount, String visitorNotes, String[] names, DEPARTMENT department) {
        super(id, approved, possibleTimes, visitorCount, visitorNotes, EVENT_TYPES.INDIVIDUAL_TOUR);
        this.names = names;
        this.department = department;
    }
}
