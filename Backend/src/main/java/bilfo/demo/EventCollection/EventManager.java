package bilfo.demo.EventCollection;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/event")
public class EventManager {
    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> allEvents() {
        return new ResponseEntity<List<Event>>(eventService.allEvents(), HttpStatus.OK);
    }

    @PostMapping("/claimTour")
    public ResponseEntity<String> claimTour(@RequestBody Map<String, String> eventClaimRequest)
    {
        int bilkentId = Integer.parseInt(eventClaimRequest.get("bilkentId"));
        ObjectId eventId = new ObjectId(eventClaimRequest.get("eventId"));
        if(eventService.claimEvent(bilkentId, eventId))
        {
            return new ResponseEntity<>("Claimed event", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unsuccesful claim", HttpStatus.BAD_REQUEST);
    }

}


