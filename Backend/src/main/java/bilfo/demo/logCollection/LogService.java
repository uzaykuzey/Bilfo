package bilfo.demo.logCollection;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.Triple;
import bilfo.demo.enums.EVENT_STATES;
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
        List<ObjectId> userLogs = user.get().getLogs();
        for(int i = 0;i<userLogs.size();i++){
            Optional<Log> log = logRepository.findLogById(userLogs.get(i));
            if(log.isPresent()) {
                if (log.get().getEventId().toString().equals(eventId.toString())) {
                    return Optional.empty();
                }
            }
        }
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

    public boolean deleteLog(int bilkentId,ObjectId logId)
    {
        Optional<Log> log = logRepository.findById(logId);
        if(log.isEmpty())
        {
            return false;
        }
        Optional<User> user = userService.getUser(bilkentId);
        if(user.isEmpty())
        {
            return false;
        }
        user.get().getLogs().remove(log.get().getId());
        logRepository.delete(log.get());
        userService.saveUser(user.get());
        return true;
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

    public List<Triple<Log, Event, Form>> getLogs(int bilkentId, Date startDate, boolean requiresForms)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return new ArrayList<>();
        }

        return getLogs(optionalUser.get(), startDate, requiresForms);
    }

    public List<Triple<Log, Event, Form>> getLogs(User user, Date startDate, boolean requiresForms)
    {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startOfMonth = calendar.getTime();

        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date endOfMonth = calendar.getTime();
        List<Triple<Log, Event, Form>> result=new ArrayList<>();
        if(user.getLogs() != null) {
            for (ObjectId id : user.getLogs()) {
                Optional<Log> optionalLog = logRepository.findById(id);
                if (optionalLog.isEmpty()) {
                    continue;
                }
                Log log = optionalLog.get();

                Form form = null;
                Event event = null;
                if (requiresForms) {
                    Optional<Event> optionalEvent = eventService.getEvent(log.getEventId());
                    if (optionalEvent.isEmpty()) {
                        continue;
                    }
                    event = optionalEvent.get();

                    Optional<Form> optionalForm = formService.getForm(event.getOriginalForm());
                    if (optionalForm.isEmpty()) {
                        continue;
                    }
                    form = optionalForm.get();
                }

                if (log.getDate().after(startOfMonth) && log.getDate().before(endOfMonth)) {
                    result.add(Triple.of(log, event, form));
                }
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
            if(user.getStatus()== USER_STATUS.ACTING_DIRECTOR || user.getStatus() == USER_STATUS.COORDINATOR || user.getStatus() == USER_STATUS.ADMIN)
            {
                continue;
            }
            double hours=0;
            for(var logFormPair: getLogs(user, startDate, false))
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
            for(var logFormPair: getLogs(user, monthDate, false))
            {
                Log log=logFormPair.getFirst();
                log.setPaid(true);
                logRepository.save(log);
            }
        }
    }

    public void markAllLogsAsPaid(int bilkentId, Date monthDate)
    {
        for(var logFormPair: getLogs(bilkentId, monthDate, false))
        {
            Log log=logFormPair.getFirst();
            log.setPaid(true);
            logRepository.save(log);
        }
    }

    public List<Pair<Event, Form>> getEventsOfUserThatDontHaveLogsAndFinished(int bilkentId)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        List<Pair<Event, Form>> result=new ArrayList<>();
        if(optionalUser.isEmpty())
        {
            return result;
        }
        User user = optionalUser.get();

        for(var pair: eventService.getEvents(EVENT_STATES.COMPLETED))
        {
            Event event = pair.getFirst();
            if(!userHasLogForThisEvent(user, event) && (event.getGuides().contains(bilkentId) || event.getTrainees().contains(bilkentId)))
            {
                result.add(pair);
            }
        }
        return result;
    }

    private boolean userHasLogForThisEvent(User user, Event event)
    {
        for(ObjectId logId: user.getLogs())
        {
            Optional<Log> optionalLog=logRepository.findById(logId);
            if(optionalLog.isEmpty())
            {
                continue;
            }
            Log log = optionalLog.get();
            if(log.getEventId().equals(event.getId()))
            {
                return true;
            }
        }
        return false;
    }

    public double getTotalHoursOfService(int bilkentId)
    {
        Optional<User> optionalUser = userService.getUser(bilkentId);
        if(optionalUser.isEmpty())
        {
            return 0;
        }
        User user = optionalUser.get();
        double result = 0;
        for(ObjectId logId: user.getLogs())
        {
            Optional<Log> optionalLog=logRepository.findById(logId);
            if(optionalLog.isEmpty())
            {
                continue;
            }
            result+=optionalLog.get().getHours();
        }
        return result;
    }
}
