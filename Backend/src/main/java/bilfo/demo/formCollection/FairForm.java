package bilfo.demo.formCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class FairForm extends Form {
    private String location;
    private ObjectId schoolId;

    public FairForm(ObjectId id, boolean approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, String location, ObjectId schoolId) {
        super(id, approved, possibleTimes, EVENT_TYPES.FAIR);
        this.location = location;
        this.schoolId = schoolId;
    }
}