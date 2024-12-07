package bilfo.demo.schoolCollection;


import bilfo.demo.enums.CITIES;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class SchoolService {
    @Autowired
    private SchoolRepository schoolRepository;
    private static final Logger logger = LoggerFactory.getLogger(SchoolService.class);

    public List<School> allSchools(){
        return schoolRepository.findAll();
    }

    public Optional<School> getSchool(ObjectId id){
        return schoolRepository.findById(id);
    }

    public Optional<School> createSchool(String name, CITIES location) {
        logger.info("Creating school with name: {}", name);

        // Check if school already exists
        //TODO
        /*Optional<School> existingUser = schoolRepository.findSchoolById(id);
        if (existingUser.isPresent()) {
            logger.warn("School with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        // Create the new School object
        School school = new School(new ObjectId(), name, location);

        // Save the school in the database
        School savedSchool = schoolRepository.save(school);
        logger.info("School with ID {} created successfully.", school.getId());

        return Optional.of(savedSchool);
    }
}
