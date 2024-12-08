package bilfo.demo.userCollection;


import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public List<User> allUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUser(ObjectId id){
        return userRepository.findById(id);
    }

    public Optional<User> getUser(int bilkentId){
        return userRepository.findByBilkentId(bilkentId);
    }

    public Optional<User> createUser(int bilkentId, String username, String email, String password, USER_STATUS status, DEPARTMENT department, List<ObjectId> logs, List<ObjectId> suggestedEvents, boolean trainee, boolean[] availability, DAY day) {
        logger.info("Creating user with ID: {}", bilkentId);

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByBilkentId(bilkentId);
        if (existingUser.isPresent()) {
            logger.warn("User with ID {} already exists. User creation failed.", bilkentId);
            return Optional.empty();  // User already exists
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(password);
        logger.info("Password hashed successfully for user ID: {}", bilkentId);

        // Create the new User object
        User newUser;

        if(status!=USER_STATUS.GUIDE)
        {
            newUser=new Advisor(new ObjectId(), bilkentId, status, username, email, hashedPassword, department, logs, suggestedEvents, availability, day);
        }
        else
        {
            newUser = new User(new ObjectId(), bilkentId, status, username, email, hashedPassword, department, logs, suggestedEvents, trainee, availability);
        }

        // Save the user in the database
        User savedUser = userRepository.save(newUser);
        logger.info("User with ID {} created successfully.", bilkentId);

        return Optional.of(savedUser);
    }

    public Optional<User> authenticate(int bilkentId, String password) {

        Optional<User> user = userRepository.findByBilkentId(bilkentId);

        if (user.isPresent()) {
            if (passwordEncoder.matches(password, user.get().getPassword())) {
                return user;
            } else {
                logger.warn("Invalid password for user ID: {}", bilkentId);
            }
        } else {
            logger.warn("User not found for ID: {}", bilkentId);
        }

        return Optional.empty();
    }

    public void changeUsername(int bilkentId, String username){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().setUsername(username);
            userRepository.save(user.get());
        }
    }
    public void changeEmail(int bilkentId, String email){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().setEmail(email);
            userRepository.save(user.get());
        }
    }
    public void changePassword(int bilkentId, String password){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().setPassword(password);
            userRepository.save(user.get());
        }
    }

    public void changeAvailability(int bilkentId, int slot, boolean availability){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().getAvailability()[slot] = availability;
            userRepository.save(user.get());
        }
    }

    public void addLog(ObjectId logId, int bilkentId)
    {
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if(!user.isPresent() || user.get().getLogs().contains(logId))
        {
            return;
        }
        user.get().getLogs().add(logId);
        userRepository.save(user.get());
    }

    public void removeLog(ObjectId logId, int bilkentId)
    {
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if(!user.isPresent() || !user.get().getLogs().contains(logId))
        {
            return;
        }
        user.get().getLogs().remove(logId);
        userRepository.save(user.get());
    }

    public List<Advisor> getAdvisorsOfTheDay(DAY day)
    {
        Optional<List<User>> advisors = userRepository.findUsersByStatus(USER_STATUS.ADVISOR);
        List<Advisor> result = new ArrayList<>();
        if(!advisors.isPresent())
        {
            return result;
        }

        for(User user : advisors.get())
        {
            if(((Advisor) user).getDayOfAdvisor() == day)
            {
                result.add((Advisor) user);
            }
        }
        return result;
    }

    public boolean promote(int bilkentId, DAY day)
    {
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if(!user.isPresent())
        {
            return false;
        }

        return switch (user.get().getStatus()) {
            case GUIDE -> promoteToAdvisor((Guide) user.get(), day);
            case ADVISOR -> promoteToCoordinator((Advisor) user.get());
            default -> false;
        };
    }

    private boolean promoteToAdvisor(Guide guide, DAY day)
    {
        int bilkentId = guide.getBilkentId();
        String username = guide.getUsername();
        String email = guide.getEmail();
        String password = guide.getPassword();
        DEPARTMENT department = guide.getDepartment();
        List<ObjectId> logs = guide.getLogs();
        List<ObjectId> suggestedEvents = guide.getSuggestedEvents();
        boolean[] availability = guide.getAvailability();

        userRepository.deleteById(guide.getId());
        this.createUser(bilkentId, username, email, password, USER_STATUS.ADVISOR, department, logs, suggestedEvents, false, availability, day);
        return true;
    }

    private boolean promoteToCoordinator(Advisor advisor)
    {
        Optional<List<User>> coordinators = userRepository.findUsersByStatus(USER_STATUS.COORDINATOR);
        if(coordinators.isPresent() && !coordinators.get().isEmpty())
        {
            return false;
        }

        int bilkentId = advisor.getBilkentId();
        String username = advisor.getUsername();
        String email = advisor.getEmail();
        String password = advisor.getPassword();
        DEPARTMENT department = advisor.getDepartment();
        List<ObjectId> logs = advisor.getLogs();
        List<ObjectId> suggestedEvents = advisor.getSuggestedEvents();
        boolean[] availability = advisor.getAvailability();

        this.createUser(bilkentId, username, email, password, USER_STATUS.COORDINATOR, department, logs, suggestedEvents, false, availability, DAY.NOT_ASSIGNED);
        return true;
    }
}
