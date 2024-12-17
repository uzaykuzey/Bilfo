package bilfo.demo.logCollection;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/log")
public class LogManager {
    @Autowired
    private LogService logService;

    @GetMapping
    public ResponseEntity<List<Log>> allLogs() {
        return new ResponseEntity<List<Log>>(logService.allLogs(), HttpStatus.OK);
    }

    /*@PostMapping("/addLog")
    public ResponseEntity<String> addLog(@RequestBody Map<String, String> addLogRequest) {
        int bilkentId = Integer.parseInt(addLogRequest.get("bilkentId"));
        ObjectId logId = new ObjectId(addLogRequest.get("logId"));

    }*/
}


