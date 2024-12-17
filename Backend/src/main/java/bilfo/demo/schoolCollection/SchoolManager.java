package bilfo.demo.schoolCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/school")
public class SchoolManager {
    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public ResponseEntity<List<School>> allSchools() {
        return new ResponseEntity<List<School>>(schoolService.allSchools(), HttpStatus.OK);
    }
}


