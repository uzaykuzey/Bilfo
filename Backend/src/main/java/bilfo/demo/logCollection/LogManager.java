package bilfo.demo.logCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/log")
public class LogManager {
    @Autowired
    private LogService logService;

    @GetMapping
    public ResponseEntity<List<Log>> allLogs() {
        return new ResponseEntity<List<Log>>(logService.allLogs(), HttpStatus.OK);
    }
}


