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
        logger.info("Creating counselor with name: {}", name);

        Optional<Counselor> existingUser = counselorRepository.findCounselorByEmail(email);
        if(existingUser.isPresent()) {
            logger.warn("Counselor with ID {} already exists. User creation failed.", email);
            return Optional.empty();
        }

        // Create the new Counselor object
        Counselor counselor = new Counselor(new ObjectId(), name, email, phoneNo, schoolName);

        // Save the counselor in the database
        Counselor savedcounselor = counselorRepository.save(counselor);
        logger.info("Counselor with name {} created successfully.", name);

        return Optional.of(savedcounselor);
    }
}
