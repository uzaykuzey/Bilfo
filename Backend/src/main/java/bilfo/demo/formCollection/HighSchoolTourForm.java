package bilfo.demo.formCollection;

import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
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

    public HighSchoolTourForm(ObjectId id, boolean approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, int visitorCount, String visitorNotes, ObjectId schoolId, ObjectId counselorId) {
        super(id, approved, possibleTimes, visitorCount, visitorNotes, EVENT_TYPES.HIGHSCHOOL_TOUR);
        this.schoolId = schoolId;
        this.counselorId = counselorId;
    }
}
