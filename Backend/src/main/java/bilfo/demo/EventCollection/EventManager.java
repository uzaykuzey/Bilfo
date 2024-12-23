package bilfo.demo.EventCollection;

import bilfo.demo.EventCollection.feedbackCollection.Feedback;
import bilfo.demo.Triple;
import bilfo.demo.enums.DAY;
import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormManager;
import bilfo.demo.userCollection.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/event")
public class EventManager {
    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> allEvents() {
        return new ResponseEntity<List<Event>>(eventService.allEvents(), HttpStatus.OK);
    }

    @PostMapping("/claimEvent")
    public ResponseEntity<String> claimEvent(@RequestBody Map<String, String> eventClaimRequest)
    {
        int bilkentId = Integer.parseInt(eventClaimRequest.get("bilkentId"));
        ObjectId formId = new ObjectId(eventClaimRequest.get("formId"));
        if(eventService.claimEvent(bilkentId, formId, true))
        {
            return new ResponseEntity<>("Successfully claimed event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful claim", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/offerEvent")
    public ResponseEntity<String> offerEvent(@RequestBody Map<String, String> eventOfferRequest)
    {
        int bilkentId = Integer.parseInt(eventOfferRequest.get("bilkentId"));
        ObjectId formId = new ObjectId(eventOfferRequest.get("formId"));
        if(eventService.claimEvent(bilkentId, formId, false))
        {
            return new ResponseEntity<>("Successfully claimed event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful claim", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/rejectSuggestedEvent")
    public ResponseEntity<String> rejectSuggestedEvent(@RequestBody Map<String, String> eventRejectRequest)
    {
        int bilkentId = Integer.parseInt(eventRejectRequest.get("bilkentId"));
        ObjectId eventId = new ObjectId(eventRejectRequest.get("eventId"));

        if(eventService.rejectSuggestedEvent(bilkentId, eventId))
        {
            return new ResponseEntity<>("Successfully rejected event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful reject event", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> feedback(@RequestBody Map<String, String> eventFeedbackRequest)
    {
        String contactMail = eventFeedbackRequest.get("contactMail");
        String password = eventFeedbackRequest.get("password");
        int rating = Integer.parseInt(eventFeedbackRequest.get("rating"));
        String experience = eventFeedbackRequest.get("experience");
        String recommendation = eventFeedbackRequest.get("recommendation");
        if(!eventService.eventDateIsOkay(contactMail,password)){
            return new ResponseEntity<>("The event has not been completed!!!",HttpStatus.BAD_REQUEST);
        }
        if(eventService.sendFeedback(contactMail, password, rating, experience, recommendation))
        {
            return new ResponseEntity<>("Feedback sent", HttpStatus.OK);
        }
        return new ResponseEntity<>("Feedback send failed", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getFeedback")
    public ResponseEntity<Feedback> getFeedback(@RequestParam String eventId) {
        Optional<Feedback> feedback = eventService.getFeedback(new ObjectId(eventId));
        return new ResponseEntity<>(feedback.orElse(null), feedback.isEmpty() ? HttpStatus.NOT_FOUND : HttpStatus.OK);
    }

    @GetMapping("/getAllFeedbacks")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = eventService.getAllFeedbacks();
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    @GetMapping("/getScheduleOfWeek")
    public ResponseEntity<String[]> getScheduleOfWeek(@RequestParam Map<String, String> getScheduleOfWeekRequest) {
        int bilkentId = Integer.parseInt(getScheduleOfWeekRequest.get("bilkentId"));
        String date = getScheduleOfWeekRequest.get("weekStartDate");
        return new ResponseEntity<>(eventService.getScheduleOfWeek(bilkentId, date), HttpStatus.OK);
    }

    @GetMapping("/getEvents")
    public ResponseEntity<List<Pair<Event, Form>>> getEvents(@RequestParam Map<String, String> getEventRequest) {
        EVENT_TYPES type = EVENT_TYPES.valueOf(getEventRequest.get("type"));
        EVENT_STATES state = EVENT_STATES.ONGOING;
        if(getEventRequest.containsKey("state"))
        {
            state = EVENT_STATES.valueOf(getEventRequest.get("state"));
        }
        return new ResponseEntity<>(eventService.getEvents(type, state), HttpStatus.OK);
    }

    @GetMapping("/getSuggestedEvents")
    public ResponseEntity<List<Pair<Event, Form>>> getSuggestedEvents(@RequestParam int bilkentId) {
        return new ResponseEntity<>(eventService.getSuggestedEvents(bilkentId), HttpStatus.OK);
    }

    @GetMapping("/hasSuggestedEvents")
    public ResponseEntity<Boolean> hasSuggestedEvents(@RequestParam int bilkentId) {
        return new ResponseEntity<>(eventService.hasSuggestedEvents(bilkentId), HttpStatus.OK);
    }

    @GetMapping("/getGuidesOfEvent")
    public ResponseEntity<Triple<List<Optional<User>>,List<Optional<User>>,List<Optional<User>>>> getGuidesOfEvent(@RequestParam Map<String,String> event){
        ObjectId eventId = new ObjectId(event.get("eventId"));
        Triple<List<Optional<User>>,List<Optional<User>>,List<Optional<User>>> allGuides = eventService.getGuidesOfEvent(eventId);
        return new ResponseEntity<>(allGuides,HttpStatus.OK);
    }

    @PostMapping("/cancelEvent")
    public ResponseEntity<String> cancelEvent(@RequestParam String formId, @RequestParam String eventId)
    {
        ObjectId form=new ObjectId(formId);
        ObjectId event=new ObjectId(eventId);
        return null;
    }
}