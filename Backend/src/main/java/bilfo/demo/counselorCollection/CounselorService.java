package bilfo.demo.counselorCollection;


import bilfo.demo.counselorCollection.Counselor;
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

    public Optional<Counselor> createCounselor(String name, String email, int phoneNo, ObjectId schoolId) {
        logger.info("Creating counselor with name: {}", name);

        // Check if counselor already exists
        //TODO
        /*Optional<Counselor> existingUser = counselorRepository.findCounselorById(id);
        if (existingUser.isPresent()) {
            logger.warn("Counselor with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        // Create the new Counselor object
        Counselor counselor = new Counselor(new ObjectId(), name, email, phoneNo, schoolId);

        // Save the counselor in the database
        Counselor savedcounselor = counselorRepository.save(counselor);
        logger.info("Counselor with name {} created successfully.", name);

        return Optional.of(savedcounselor);
    }
}
