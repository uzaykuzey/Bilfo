package bilfo.demo.formCollection;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.counselorCollection.Counselor;
import bilfo.demo.counselorCollection.CounselorRepository;
import bilfo.demo.counselorCollection.CounselorService;
import bilfo.demo.enums.*;
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
    private CounselorRepository counselorRepository;
    @Autowired
    private CounselorService counselorService;

    @GetMapping
    public ResponseEntity<List<Form>> allForms() {
        List<Form> forms = formService.allForms();
        return ResponseEntity.ok(forms);
    }

    @PostMapping("/hsform")
    public ResponseEntity<String> applyForHighschoolTour(@RequestBody Map<String, String> formApplication) {
        String schoolName=formApplication.get("schoolName");
        String city=formApplication.get("city");
        String district=formApplication.get("district");
        System.out.println(formApplication.get("counselorName"));
        Optional<Counselor> counselorOptional=counselorRepository.findCounselorByEmail(formApplication.get("email"));
        String counselorEmail;
        if(counselorOptional.isPresent())
        {
            Counselor counselor=counselorOptional.get();
            counselor.setEmail(formApplication.get("email"));
            counselor.setName(formApplication.get("counselorName"));
            counselor.setPhoneNo(formApplication.get("phoneNo"));
            counselorRepository.save(counselor);

            counselorEmail=counselor.getEmail();
        }
        else
        {
            Counselor c=counselorService.createCounselor(formApplication.get("counselorName"), formApplication.get("email"), formApplication.get("phoneNo"), schoolName).get();
            counselorEmail = c.getEmail();
        }

        List<Pair<Date, TOUR_TIMES>> dates=createPossibleTimes(formApplication);

        int visitorCount=Integer.parseInt(formApplication.get("visitorCount"));
        String visitorNotes=formApplication.get("visitorNotes");

        Optional<Form> newForm = formService.createForm(EVENT_TYPES.HIGHSCHOOL_TOUR, FORM_STATES.NOT_REVIEWED, dates, counselorEmail, city, district, schoolName, visitorCount, visitorNotes, counselorEmail, null, DEPARTMENT.NOT_APPLICABLE);
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

        String contactMail = formApplication.get("contactMail");
        Optional<Form> newForm = formService.createForm(EVENT_TYPES.INDIVIDUAL_TOUR, FORM_STATES.NOT_REVIEWED, dates, contactMail, "", "", null, visitorCount, visitorNotes, null, names, department);
        if(newForm.isPresent())
        {
            return new ResponseEntity<String>("Form created", HttpStatus.CREATED);
        }
        return new ResponseEntity<String>("Form creation failed", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/fairform")
    public ResponseEntity<String> applyForFair(@RequestBody Map<String, String> formApplication)
    {
        String schoolName = formApplication.get("schoolName");
        String city=formApplication.get("city");
        String district=formApplication.get("district");
        Date date = stringToDate(formApplication.get("date"));
        String contactMail = formApplication.get("contactMail");
        List<Pair<Date, TOUR_TIMES>> dates=new ArrayList<>();
        dates.add(Pair.of(date, TOUR_TIMES.WHOLE_DAY));

        Optional<Form> newForm=formService.createForm(EVENT_TYPES.FAIR, FORM_STATES.NOT_REVIEWED, dates, contactMail, city, district, schoolName, 0, "", null, null, DEPARTMENT.NOT_APPLICABLE);
        if(newForm.isPresent())
        {
            return new ResponseEntity<String>("Form created", HttpStatus.CREATED);
        }
        return new ResponseEntity<String>("Form creation failed", HttpStatus.BAD_REQUEST);
    }



    @PostMapping("/eva")
    public ResponseEntity<String> evaForm(@RequestBody Map<String,Object> evaluationForm){
        ObjectId formId = new ObjectId(evaluationForm.get("formId").toString());
        FORM_STATES state = FORM_STATES.valueOf(evaluationForm.get("state").toString().toUpperCase());
        Optional<Form> form = formService.getForm(formId);
        int indexValue = Integer.parseInt(evaluationForm.get("index").toString());
        TOUR_TIMES time = form.get().getPossibleTimes().get(indexValue).getSecond();
        Date date = form.get().getPossibleTimes().get(indexValue).getFirst();
        String rejectionMessage = evaluationForm.get("rejectionMessage").toString();
        Optional<Event> event = formService.evaluateForm(formId, state, date, time, rejectionMessage);
        if(event.isPresent())
        {
            return new ResponseEntity<String>("Form evaluated.", HttpStatus.OK);
        }
        return new ResponseEntity<String>("Form evaluation failed.", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getForms")
    public ResponseEntity<List<Form>> getForms(@RequestParam Map<String, String> getFormsRequest)
    {
        FORM_STATES state = FORM_STATES.valueOf(getFormsRequest.get("state").toUpperCase());
        EVENT_TYPES type = EVENT_TYPES.valueOf(getFormsRequest.get("type").toUpperCase());
        SORTING_TYPES sort=SORTING_TYPES.BY_DATE_OF_FORM;
        if(getFormsRequest.containsKey("sort"))
        {
            sort = SORTING_TYPES.valueOf(getFormsRequest.get("sort").toUpperCase());
        }
        if(state==FORM_STATES.ACCEPTED)
        {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(formService.getForms(type, state, sort), HttpStatus.OK);
    }


    private List<Pair<Date, TOUR_TIMES>> createPossibleTimes(Map<String, String> formApplication) {
        TOUR_TIMES time1 = TOUR_TIMES.stringToTourTime(formApplication.get("time1"));
        TOUR_TIMES time2 = TOUR_TIMES.stringToTourTime(formApplication.get("time2"));
        TOUR_TIMES time3 = TOUR_TIMES.stringToTourTime(formApplication.get("time3"));

        Date date1 = stringToDate(formApplication.get("date1"));
        Date date2 = stringToDate(formApplication.get("date2"));
        Date date3 = stringToDate(formApplication.get("date3"));

        List<Pair<Date, TOUR_TIMES>> dates=new ArrayList<>();
        dates.add(Pair.of(date1, time1));
        dates.add(Pair.of(date2, time2));
        dates.add(Pair.of(date3, time3));
        return dates;
    }

    public static Date stringToDate(String dateString) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}


