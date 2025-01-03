package bilfo.demo.counselorCollection;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class CounselorService {
    @Autowired
    private CounselorRepository counselorRepository;
    private static final Logger logger = LoggerFactory.getLogger(CounselorService.class);

    public List<Counselor> allCounselors(){
        return counselorRepository.findAll();
    }

    public Optional<Counselor> getCounselor(ObjectId id){
        return counselorRepository.findById(id);
    }

    public Optional<Counselor> createCounselor(String name, String email, String phoneNo, String schoolName) {
        try {
            if (name == null || email == null || phoneNo == null || schoolName == null) {
                return Optional.empty();
            }

            Optional<Counselor> existingUser = counselorRepository.findCounselorByEmail(email);
            if(existingUser.isPresent()) {
                return Optional.empty();
            }

            Counselor counselor = new Counselor(new ObjectId(), name, email, phoneNo, schoolName);
            Counselor savedCounselor = counselorRepository.save(counselor);
            return Optional.of(savedCounselor);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Counselor updateCounselor(Counselor counselor) {
        return counselorRepository.save(counselor);
    }

    public void deleteCounselor(ObjectId id) {
        counselorRepository.deleteById(id);
    }
}
