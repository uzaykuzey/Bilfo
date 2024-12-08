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
    private ObjectId schoolId;
    private ObjectId counselorId;
    private CITIES location;

    public HighSchoolTourForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, int visitorCount, String visitorNotes, ObjectId schoolId, ObjectId counselorId, CITIES location) {
        super(id, approved, possibleTimes, visitorCount, visitorNotes, EVENT_TYPES.HIGHSCHOOL_TOUR);
        this.schoolId = schoolId;
        this.counselorId = counselorId;
        this.location = location;
    }
}
