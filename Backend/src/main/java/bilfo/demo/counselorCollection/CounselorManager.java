package bilfo.demo.counselorCollection;

import bilfo.demo.schoolCollection.School;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class CounselorManager {
    @Autowired
    private CounselorService counselorService;

    @GetMapping
    public ResponseEntity<List<Counselor>> allCounselors() {
        return new ResponseEntity<List<Counselor>>(counselorService.allCounselors(), HttpStatus.OK);
    }
}


