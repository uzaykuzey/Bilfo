package bilfo.demo.formCollection;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "forms")
@AllArgsConstructor
@NoArgsConstructor
@TypeAlias("form")
public class Form {
    @Id
    private ObjectId id;

    private FORM_STATES approved;
    private List<Pair<Date, TOUR_TIMES>> possibleTimes;
    private EVENT_TYPES type;
}