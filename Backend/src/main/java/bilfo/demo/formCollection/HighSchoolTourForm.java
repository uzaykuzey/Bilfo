package bilfo.demo.formCollection;

import bilfo.demo.enums.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;

public class HighSchoolTourForm extends TourForm {
    private String schoolName;
    private String counselorEmail;
    private CITIES location;

    public HighSchoolTourForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, int visitorCount, String visitorNotes, String schoolName, String counselorEmail, CITIES location) {
        super(id, approved, possibleTimes, visitorCount, visitorNotes, EVENT_TYPES.HIGHSCHOOL_TOUR);
        this.schoolName = schoolName;
        this.counselorEmail = counselorEmail;
        this.location = location;
    }
}
