package bilfo.demo.EventCollection;

import bilfo.demo.EventCollection.feedbackCollection.Feedback;
import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.formCollection.Form;
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
            return new ResponseEntity<>("Claimed event", HttpStatus.OK);
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
            return new ResponseEntity<>("Claimed event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful claim", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> feedback(@RequestBody Map<String, String> eventFeedbackRequest)
    {
        String contactMail = eventFeedbackRequest.get("contactMail");
        String password = eventFeedbackRequest.get("password");
        int rating = Integer.parseInt(eventFeedbackRequest.get("rating"));
        String experience = eventFeedbackRequest.get("experience");
        String recommendation = eventFeedbackRequest.get("recommendation");
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
}


