package bilfo.demo.formCollection;

import bilfo.demo.enums.*;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.util.Pair;

import java.util.Date;
import java.util.List;
@Getter
@Setter
@TypeAlias("highSchoolTourForm")
public class HighSchoolTourForm extends TourForm {
    private String schoolName;
    private String counselorEmail;
    private String city;
    private String district;

    public HighSchoolTourForm(ObjectId id, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleTimes, String contactMail, int visitorCount, String visitorNotes, String schoolName, String counselorEmail, String city, String district) {
        super(id, approved, possibleTimes, contactMail, visitorCount, visitorNotes, EVENT_TYPES.HIGHSCHOOL_TOUR);
        this.schoolName = schoolName;
        this.counselorEmail = counselorEmail;
        this.city = city;
        this.district = district;
    }
}
