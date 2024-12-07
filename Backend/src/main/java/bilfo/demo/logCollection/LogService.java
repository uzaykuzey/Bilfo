package bilfo.demo.logCollection;

import bilfo.demo.enums.TOUR_TIMES;
import bilfo.demo.userCollection.User;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;
    private static final Logger logger = LoggerFactory.getLogger(LogService.class);

    public List<Log> allLogs(){
        return logRepository.findAll();
    }

    public Optional<Log> getLog(ObjectId id){
        return logRepository.findById(id);
    }

    public Optional<Log> createLog(int hours, ObjectId eventId, boolean paid) {
        logger.info("Creating Log");

        // Check if Log already exists
        //TODO
        /*Optional<Log> existingUser = LogRepository.findLogById(id);
        if (existingUser.isPresent()) {
            logger.warn("Log with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        // Create the new Log object
        Log log = new Log(new ObjectId(), hours, eventId, paid);

        // Save the Log in the database
        Log savedLog = logRepository.save(log);
        logger.info("Log with ID {} created successfully.", log.getId());

        return Optional.of(savedLog);
    }


}
