package bilfo.demo.logCollection;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.enums.TOUR_TIMES;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormService;
import bilfo.demo.userCollection.User;
import bilfo.demo.userCollection.UserService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
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
    @Autowired
    private FormService formService;

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

    public Optional<Log> addLog(int bilkentId, ObjectId eventId, boolean paid)
    {
        Optional<Event> event = eventService.getEvent(eventId);
        if(event.isEmpty())
        {
            return Optional.empty();
        }

        LocalTime localTime = LocalTime.parse(event.get().getTime().toString(), DateTimeFormatter.ofPattern("HH.mm"));

        double hours = ((int)Math.abs(ChronoUnit.MINUTES.between(localTime, LocalTime.now())))/60.0;

        return addLog(bilkentId, hours, eventId, paid);
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

    public List<Pair<Log, Form>> getLogs(int bilkentId, Date startDate)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return new ArrayList<>();
        }

        return getLogs(optionalUser.get(), startDate);
    }

    public List<Pair<Log, Form>> getLogs(User user, Date startDate)
    {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startOfMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date endOfMonth = calendar.getTime();
        List<Pair<Log, Form>> result=new ArrayList<>();

        for(ObjectId id: user.getLogs())
        {
            Optional<Log> optionalLog=logRepository.findById(id);
            if(optionalLog.isEmpty())
            {
                continue;
            }
            Log log = optionalLog.get();

            Optional<Event> optionalEvent=eventService.getEvent(log.getEventId());
            if(optionalEvent.isEmpty())
            {
                continue;
            }
            Event event = optionalEvent.get();

            Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
            if(optionalForm.isEmpty())
            {
                continue;
            }
            Form form=optionalForm.get();

            if(log.getDate().after(startOfMonth) && log.getDate().before(endOfMonth))
            {
                result.add(Pair.of(log, form));
            }
        }
        return result;
    }

    public List<Pair<User, Double>> getAllGuidesLogTable(Date startDate)
    {
        userService.allUsers();
        List<Pair<User, Double>> result=new ArrayList<>();
        for(User user: userService.allUsers())
        {
            if(user.getStatus()== USER_STATUS.ACTING_DIRECTOR)
            {
                continue;
            }
            double hours=0;
            for(Pair<Log, Form> logFormPair: getLogs(user, startDate))
            {
                hours+=logFormPair.getFirst().getHours();
            }
            result.add(Pair.of(user, hours));
        }
        return result;
    }

    public void markAllLogsAsPaid(Date monthDate)
    {
        List<User> allUsers = userService.allUsers();
        for(User user: allUsers)
        {
            for(Pair<Log, Form> logFormPair: getLogs(user, monthDate))
            {
                Log log=logFormPair.getFirst();
                log.setPaid(true);
                logRepository.save(log);
            }
        }
    }

    public void markAllLogsAsPaid(int bilkentId, Date monthDate)
    {
        for(Pair<Log, Form> logFormPair: getLogs(bilkentId, monthDate))
        {
            Log log=logFormPair.getFirst();
            log.setPaid(true);
            logRepository.save(log);
        }
    }
}
