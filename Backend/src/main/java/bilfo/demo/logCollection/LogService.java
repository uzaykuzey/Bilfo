package bilfo.demo.logCollection;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.enums.TOUR_TIMES;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;
    private static final Logger logger = LoggerFactory.getLogger(LogService.class);
    @Autowired
    private UserService userService;
    @Autowired
    private EventService eventService;

    public List<Log> allLogs(){
        return logRepository.findAll();
    }

    public Optional<Log> getLog(ObjectId id){
        return logRepository.findById(id);
    }

    public Optional<Log> createLog(double hours, ObjectId eventId, boolean paid) {
        logger.info("Creating Log");

        // Check if Log already exists
        //TODO
        /*Optional<Log> existingUser = LogRepository.findLogById(id);
        if (existingUser.isPresent()) {
            logger.warn("Log with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        Optional<Event> event = eventService.getEvent(eventId);
        if(event.isEmpty())
        {
            return Optional.empty();
        }

        // Create the new Log object
        Log log = new Log(new ObjectId(), hours, event.get().getDate(),eventId, paid);

        // Save the Log in the database
        Log savedLog = logRepository.save(log);
        logger.info("Log with ID {} created successfully.", log.getId());

        return Optional.of(savedLog);
    }

    public Optional<Log> addLog(int bilkentId, double hours, ObjectId eventId, boolean paid)
    {
        Optional<User> user = userService.getUser(bilkentId);
        if(user.isEmpty())
        {
            return Optional.empty();
        }

        Optional<Event> event = eventService.getEvent(eventId);
        if(event.isEmpty())
        {
            return Optional.empty();
        }

        if(hours == -1)
        {
            LocalTime localTime = LocalTime.parse(event.get().getTime().toString(), DateTimeFormatter.ofPattern("HH.mm"));

            hours = ((int)Math.abs(ChronoUnit.MINUTES.between(localTime, LocalTime.now())))/60.0;
        }

        Optional<Log> log = createLog(hours, eventId, paid);
        if(log.isEmpty())
        {
            return Optional.empty();
        }
        user.get().getLogs().add(log.get().getId());

        userService.saveUser(user.get());
        logRepository.save(log.get());
        return log;
    }

    public boolean markAsPaid(ObjectId logId) {
        Optional<Log> log = getLog(logId);
        if(log.isEmpty())
        {
            return false;
        }

        log.get().setPaid(true);
        logRepository.save(log.get());
        return true;
    }

    public List<Log> getLogs(int bilkentId, Date startDate)
    {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startOfMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date endOfMonth = calendar.getTime();
        List<Log> result=new ArrayList<>();
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return new ArrayList<>();
        }
        User user = optionalUser.get();

        for(ObjectId id: user.getLogs())
        {
            Optional<Log> optionalLog=logRepository.findById(id);
            if(optionalLog.isEmpty())
            {
                continue;
            }
            Log log = optionalLog.get();
            if(log.getDate().after(startOfMonth) && log.getDate().before(endOfMonth))
            {
                result.add(log);
            }
        }
        return result;
    }
}
