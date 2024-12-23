package bilfo.demo.counselorCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;

@RestController
@RequestMapping("/counselor")
public class CounselorManager {
    @Autowired
    private CounselorService counselorService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Counselor>> allCounselors() {
        return new ResponseEntity<List<Counselor>>(counselorService.allCounselors(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Counselor> addCounselor(@RequestBody Map<String, String> payload) {
        try {
            if (!payload.containsKey("name") || !payload.containsKey("email") || 
                !payload.containsKey("phoneNo") || !payload.containsKey("school")) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<Counselor> newCounselor = counselorService.createCounselor(
                payload.get("name"),
                payload.get("email"),
                payload.get("phoneNo"),
                payload.get("school")
            );
            
            return newCounselor
                .map(counselor -> new ResponseEntity<>(counselor, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<Counselor> editCounselor(@RequestBody Map<String, String> payload) {
        Counselor counselor = new Counselor(
            new ObjectId(payload.get("id")),
            payload.get("name"),
            payload.get("email"),
            payload.get("phoneNo"),
            payload.get("school")
        );
        
        Counselor updatedCounselor = counselorService.updateCounselor(counselor);
        return new ResponseEntity<>(updatedCounselor, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteCounselor(@RequestBody Map<String, String> payload) {
        try {
            ObjectId id = new ObjectId(payload.get("id"));
            counselorService.deleteCounselor(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}


