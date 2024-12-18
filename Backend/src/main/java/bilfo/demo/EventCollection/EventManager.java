package bilfo.demo.EventCollection;

import bilfo.demo.EventCollection.feedbackCollection.Feedback;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
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
        ObjectId eventId = new ObjectId(eventClaimRequest.get("eventId"));
        if(eventService.claimEvent(bilkentId, eventId, true))
        {
            return new ResponseEntity<>("Claimed event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful claim", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/offerEvent")
    public ResponseEntity<String> offerEvent(@RequestBody Map<String, String> eventOfferRequest)
    {
        int bilkentId = Integer.parseInt(eventOfferRequest.get("bilkentId"));
        ObjectId eventId = new ObjectId(eventOfferRequest.get("eventId"));
        if(eventService.claimEvent(bilkentId, eventId, false))
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
    public ResponseEntity<String[]> getScheduleOfWeek(@RequestParam Map<String, Object> getScheduleOfWeekRequest) {
        int bilkentId = Integer.parseInt(getScheduleOfWeekRequest.get("bilkentId").toString());
        Date date = (Date) getScheduleOfWeekRequest.get("weekStartDate");
        return new ResponseEntity<>(eventService.getScheduleOfWeek(bilkentId, date), HttpStatus.OK);
    }
}


