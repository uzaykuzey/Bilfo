package bilfo.demo.formCollection;

import bilfo.demo.ObjectIdSerializer;
import bilfo.demo.SchoolManager;
import bilfo.demo.Triple;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.enums.TOUR_TIMES;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.util.Pair;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "forms")
@AllArgsConstructor
@NoArgsConstructor
@TypeAlias("form")
public class Form {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;

    private Date dateOfForm;
    private FORM_STATES approved;
    private List<Pair<Date, TOUR_TIMES>> possibleTimes;
    private EVENT_TYPES type;
    private String contactMail;

    public Triple<String, String, String> getCityDistrictSchool()
    {
        if(type==EVENT_TYPES.INDIVIDUAL_TOUR)
        {
            return null;
        }
        if(type==EVENT_TYPES.FAIR)
        {
            FairForm form=(FairForm) this;
            return Triple.of(form.getCity(), form.getDistrict(), form.getSchoolName());
        }
        HighSchoolTourForm form=(HighSchoolTourForm) this;
        return Triple.of(form.getCity(), form.getDistrict(), form.getSchoolName());
    }

    public int getBilkentAdmissions()
    {
        Triple<String, String, String> cityDistrictSchool = getCityDistrictSchool();
        if(cityDistrictSchool==null)
        {
            return 0;
        }
        return SchoolManager.getInstance().getAdmissionsToBilkent(cityDistrictSchool.getFirst(), cityDistrictSchool.getSecond(), cityDistrictSchool.getThird());
    }

    public int getPercentageOfBilkentAdmissions()
    {
        Triple<String, String, String> cityDistrictSchool = getCityDistrictSchool();
        if(cityDistrictSchool==null)
        {
            return 0;
        }
        return SchoolManager.getInstance().getBilkentToTotalAdmissionsPercentage(cityDistrictSchool.getFirst(), cityDistrictSchool.getSecond(), cityDistrictSchool.getThird());
    }
}