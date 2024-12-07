package bilfo.demo.EventCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventManager {
    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> allEvents() {
        return new ResponseEntity<List<Event>>(eventService.allEvents(), HttpStatus.OK);
    }
}


