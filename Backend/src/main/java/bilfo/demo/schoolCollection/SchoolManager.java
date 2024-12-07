package bilfo.demo.schoolCollection;

import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.userCollection.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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


