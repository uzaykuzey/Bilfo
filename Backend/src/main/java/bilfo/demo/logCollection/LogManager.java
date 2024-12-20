package bilfo.demo.logCollection;

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
@RequestMapping("/log")
public class LogManager {
    @Autowired
    private LogService logService;

    @GetMapping
    public ResponseEntity<List<Log>> allLogs() {
        return new ResponseEntity<List<Log>>(logService.allLogs(), HttpStatus.OK);
    }

    @PostMapping("/addLog")
    public ResponseEntity<String> addLog(@RequestBody Map<String, String> addLogRequest) {
        int bilkentId = Integer.parseInt(addLogRequest.get("bilkentId"));
        ObjectId eventId = new ObjectId(addLogRequest.get("eventId"));
        double hours = 0;
        if(!addLogRequest.containsKey("hours")) {
            hours = Double.parseDouble(addLogRequest.get("hours").replace(',', '.'));
            if(hours<=0)
            {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        else
        {
            hours = -1;
        }

        Optional<Log> log = logService.addLog(bilkentId, hours, eventId, false);
        if(log.isPresent()) {
            return new ResponseEntity<>("successfully added log", HttpStatus.OK);
        }
        return new ResponseEntity<>("failed to add log", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/markLogAsPaid")
    public ResponseEntity<String> markLogAsPaid(@RequestBody Map<String, String> markLogRequest) {
        ObjectId eventId = new ObjectId(markLogRequest.get("eventId"));

        if(logService.markAsPaid(eventId)) {
            return new ResponseEntity<>("successfully marked log as paid", HttpStatus.OK);
        }
        return new ResponseEntity<>("failed to mark log as paid", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/markAllLogsAsPaid")
    public ResponseEntity<String> markAllLogsAsPaid(@RequestBody Map<String, String> markLogRequest) {
        Date monthDate=FormManager.stringToDate(markLogRequest.get("monthDate"));

        if(markLogRequest.containsKey("bilkentId")) {
            logService.markAllLogsAsPaid(Integer.parseInt(markLogRequest.get("bilkentId")), monthDate);
            return new ResponseEntity<>("marked user logs as paid", HttpStatus.OK);
        }
        logService.markAllLogsAsPaid(monthDate);
        return new ResponseEntity<>("marked all logs as paid", HttpStatus.OK);
    }

    @GetMapping("/getLogs")
    public ResponseEntity<List<Pair<Log, Form>>> getLogs(@RequestParam Map<String, String> logRequest) {
        int bilkentId=Integer.parseInt(logRequest.get("bilkentId"));
        Date monthDate= FormManager.stringToDate(logRequest.get("monthDate"));
        return new ResponseEntity<>(logService.getLogs(bilkentId, monthDate), HttpStatus.OK);
    }

    @GetMapping("/getAllGuidesLogTable")
    public ResponseEntity<List<Pair<User, Double>>> getAllGuidesLogTable(@RequestParam String date) {
        Date startDate= FormManager.stringToDate(date);
        return new ResponseEntity<>(logService.getAllGuidesLogTable(startDate), HttpStatus.OK);
    }

}