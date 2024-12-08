package bilfo.demo.formCollection;

import bilfo.demo.counselorCollection.Counselor;
import bilfo.demo.counselorCollection.CounselorRepository;
import bilfo.demo.counselorCollection.CounselorService;
import bilfo.demo.enums.*;
import bilfo.demo.schoolCollection.School;
import bilfo.demo.schoolCollection.SchoolRepository;
import bilfo.demo.schoolCollection.SchoolService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/form")
public class FormManager {
    @Autowired
    private FormService formService;
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private SchoolService schoolService;
    @Autowired
    private CounselorRepository counselorRepository;
    @Autowired
    private CounselorService counselorService;

    @GetMapping
    public ResponseEntity<List<Form>> allForms() {
        return new ResponseEntity<List<Form>>(formService.allForms(), HttpStatus.OK);
    }

    @PostMapping("/hsform")
    public ResponseEntity<String> applyForHighschoolTour(@RequestBody Map<String, String> formApplication) {
        Optional<School> schoolOptional=schoolRepository.findSchoolByName(formApplication.get("schoolName"));
        ObjectId schoolId;
        CITIES city = CITIES.valueOf(formApplication.get("city").toUpperCase());
        if(schoolOptional.isPresent())
        {
            schoolId=schoolOptional.get().getId();
        }
        else
        {
            School s=schoolService.createSchool(formApplication.get("schoolName"), city).get();
            schoolId = s.getId();
        }

        Optional<Counselor> counselorOptional=counselorRepository.findCounselorByEmail(formApplication.get("email"));
        ObjectId counselorId;
        if(counselorOptional.isPresent())
        {
            counselorId=counselorOptional.get().getId();
        }
        else
        {
            Counselor c=counselorService.createCounselor(formApplication.get("counselorName"), formApplication.get("email"), formApplication.get("phoneNo"), schoolId).get();
            counselorId = c.getId();
        }

        List<Pair<Date, TOUR_TIMES>> dates=createPossibleTimes(formApplication);

        int visitorCount=Integer.parseInt(formApplication.get("visitorCount"));
        String visitorNotes=formApplication.get("visitorNotes");

        Optional<Form> newForm = formService.createForm(EVENT_TYPES.HIGHSCHOOL_TOUR, false, dates, city, schoolId, visitorCount, visitorNotes, counselorId, null, DEPARTMENT.CS);
        if(newForm.isPresent())
        {
            return new ResponseEntity<String>("Form created", HttpStatus.CREATED);
        }
        return new ResponseEntity<String>("Form creation failed", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/indform")
    public ResponseEntity<String> applyForIndividualTour(@RequestBody Map<String, String> formApplication)
    {
        String[] names = formApplication.get("names").split(",");
        DEPARTMENT department = DEPARTMENT.valueOf(formApplication.get("department"));
        int visitorCount=Integer.parseInt(formApplication.get("visitorCount"));
        if(visitorCount != names.length)
        {
            throw new IllegalArgumentException("name count != visitor count");
        }
        String visitorNotes=formApplication.get("visitorNotes");

        List<Pair<Date, TOUR_TIMES>> dates=createPossibleTimes(formApplication);

        Optional<Form> newForm = formService.createForm(EVENT_TYPES.INDIVIDUAL_TOUR, false, dates, CITIES.ANKARA, null, visitorCount, visitorNotes, null, names, department);
        if(newForm.isPresent())
        {
            return new ResponseEntity<String>("Form created", HttpStatus.CREATED);
        }
        return new ResponseEntity<String>("Form creation failed", HttpStatus.BAD_REQUEST);
    }

    private List<Pair<Date, TOUR_TIMES>> createPossibleTimes(Map<String, String> formApplication) {
        TOUR_TIMES time1 = stringToEnum(formApplication.get("time1"));
        TOUR_TIMES time2 = stringToEnum(formApplication.get("time2"));
        TOUR_TIMES time3 = stringToEnum(formApplication.get("time3"));

        Date date1 = stringToDate(formApplication.get("date1"));
        Date date2 = stringToDate(formApplication.get("date2"));
        Date date3 = stringToDate(formApplication.get("date3"));

        List<Pair<Date, TOUR_TIMES>> dates=new ArrayList<>();
        dates.add(Pair.of(date1, time1));
        dates.add(Pair.of(date2, time2));
        dates.add(Pair.of(date3, time3));
        return dates;
    }

    public static TOUR_TIMES stringToEnum(String timeString) {
        switch (timeString) {
            case  "9.00" -> {return TOUR_TIMES.NINE_AM;}
            case "11.00" -> {return TOUR_TIMES.ELEVEN_AM;}
            case "13.30" -> {return TOUR_TIMES.ONE_THIRTY_PM;}
            case "16.00" -> {return TOUR_TIMES.FOUR_PM;}
        }
        throw new IllegalArgumentException("Unknown time: " + timeString);
    }

    public static Date stringToDate(String dateString) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = sdf.parse(dateString);
            return date;
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}


