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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.*;
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

    public Optional<School> createSchool(String name, CITIES location, int bilkentAdmissions) {
        logger.info("Creating school with name: {}", name);

        // Check if school already exists
        Optional<School> existingUser = schoolRepository.findSchoolByName(name);
        if (existingUser.isPresent()) {
            logger.warn("School with ID {} already exists. User creation failed.", name);
            return Optional.empty();
        }

        // Create the new School object
        School school = new School(new ObjectId(), name, location, bilkentAdmissions);

        // Save the school in the database
        School savedSchool = schoolRepository.save(school);
        logger.info("School with ID {} created successfully.", school.getId());

        return Optional.of(savedSchool);
    }

    public void readSchoolFile(String filePath) {
        InputStream inputStream = getClass().getResourceAsStream(filePath);
        BufferedReader reader = null;

        try
        {
            reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            while ((line = reader.readLine()) != null)
            {
                String[] tokens = line.split(";");
                createSchool(tokens[0], CITIES.turkishStringToCity(tokens[1]), Integer.parseInt(tokens[2].trim()));
            }
        }
        catch (IOException e)
        {
            System.err.println("Error reading the file: " + e.getMessage());
        }
        finally
        {
            try
            {
                if (reader != null)
                {
                    reader.close();
                }
            }
            catch (IOException e)
            {
                System.err.println("Error closing the file reader: " + e.getMessage());
            }
        }
    }

    @Scheduled(fixedRate = 10000000)
    public void readSchoolFile()
    {
        readSchoolFile("/highschools.txt");
    }

}
