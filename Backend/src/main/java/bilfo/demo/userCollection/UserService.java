package bilfo.demo.userCollection;


import bilfo.demo.EventCollection.Event;
import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.mailSender.MailSenderService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private MailSenderService mailSenderService;

    public List<User> allUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUser(ObjectId id){
        return userRepository.findById(id);
    }

    public Optional<User> getUser(int bilkentId){
        return userRepository.findByBilkentId(bilkentId);
    }

    public Optional<User> createUser(int bilkentId, String username, String email, String phoneNo, String password, USER_STATUS status, DEPARTMENT department, List<ObjectId> logs, List<ObjectId> suggestedEvents, boolean trainee, boolean[] availability, DAY day) {
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
            newUser=new Advisor(new ObjectId(), bilkentId, status, username, email, phoneNo, hashedPassword, department, logs, suggestedEvents, availability, User.DEFAULT_PHOTO, day);
        }
        else
        {
            newUser = new Guide(new ObjectId(), bilkentId, status, username, email, phoneNo, hashedPassword, department, logs, suggestedEvents, trainee, availability, User.DEFAULT_PHOTO);
        }

        if(status == USER_STATUS.COORDINATOR)
        {
            Optional<List<User>> coordinators=userRepository.findUsersByStatus(USER_STATUS.COORDINATOR);
            if(coordinators.isPresent())
            {
                if (!coordinators.get().isEmpty()) {
                    return Optional.empty();
                }
            }
        }
        else if(status == USER_STATUS.ACTING_DIRECTOR)
        {
            Optional<List<User>> coordinators=userRepository.findUsersByStatus(USER_STATUS.ACTING_DIRECTOR);
            if (coordinators.isPresent()) {
                if (!coordinators.get().isEmpty()) {
                    return Optional.empty();
                }
            }
        }

        // Save the user in the database
        User savedUser = userRepository.save(newUser);
        logger.info("User with ID {} created successfully.", bilkentId);

        return Optional.of(savedUser);
    }

    public boolean removeUser(int bilkentId) {
        Optional<User> user = userRepository.findByBilkentId(bilkentId);

        // If the user does not exist, return false
        if (!user.isPresent()) {
            return false;
        }

        // Remove the user from the repository
        try {
            userRepository.delete(user.get());
            return true;
        } catch (Exception e) {
            return false;
        }
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

    public void saveUser(User user) {
        userRepository.save(user);
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

    public void changeAvailability(int bilkentId, boolean[] availabilityArray){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().setAvailability(availabilityArray);
            userRepository.save(user.get());
        }
    }

    public void changePhoto(int bilkentId, String photo){
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if (user.isPresent()) {
            user.get().setPhoto(photo);
            userRepository.save(user.get());
        }
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
            case GUIDE -> promoteGuide(user.get(), day);
            case ADVISOR -> promoteAdvisor(user.get());
            default -> false;
        };
    }

    public Optional<List<User>> getGuides(){
        Optional<List<User>> guides = userRepository.findUsersByStatus(USER_STATUS.GUIDE);
        return guides;
    }

    public Optional<List<User>> getAdvisors(){
        Optional<List<User>> advisors = userRepository.findUsersByStatus(USER_STATUS.ADVISOR);
        return advisors;
    }

    private boolean promoteGuide(User guide, DAY day)
    {
        if(guide.isTrainee())
        {
            guide.setTrainee(false);
            userRepository.save(guide);
            return true;
        }
        int bilkentId = guide.getBilkentId();
        String username = guide.getUsername();
        String email = guide.getEmail();
        String phoneNo = guide.getPhoneNo();
        String password = guide.getPassword();
        DEPARTMENT department = guide.getDepartment();
        List<ObjectId> logs = guide.getLogs();
        List<ObjectId> suggestedEvents = guide.getSuggestedEvents();
        boolean[] availability = guide.getAvailability();

        userRepository.deleteById(guide.getId());
        Optional<User> user=this.createUser(bilkentId, username, email, phoneNo, password, USER_STATUS.ADVISOR, department, logs, suggestedEvents, false, availability, day);
        return user.isPresent();
    }

    private boolean promoteAdvisor(User advisor)
    {
        Optional<List<User>> coordinators = userRepository.findUsersByStatus(USER_STATUS.COORDINATOR);
        if(coordinators.isPresent() && !coordinators.get().isEmpty())
        {
            return false;
        }

        int bilkentId = advisor.getBilkentId();
        String username = advisor.getUsername();
        String email = advisor.getEmail();
        String phoneNo = advisor.getPhoneNo();
        String password = advisor.getPassword();
        DEPARTMENT department = advisor.getDepartment();
        List<ObjectId> logs = advisor.getLogs();
        List<ObjectId> suggestedEvents = advisor.getSuggestedEvents();
        boolean[] availability = advisor.getAvailability();
        userRepository.deleteById(advisor.getId());
        System.out.println(this.createUser(bilkentId, username, email, phoneNo, password, USER_STATUS.COORDINATOR, department, logs, suggestedEvents, false, availability, DAY.NOT_ASSIGNED));
        return true;
    }

    public boolean demote(int bilkentId, DAY day)
    {
        Optional<User> user = userRepository.findByBilkentId(bilkentId);
        if(!user.isPresent())
        {
            return false;
        }

        return switch (user.get().getStatus()) {
            case GUIDE -> demoteGuide(user.get());
            case ADVISOR -> demoteAdvisor(user.get());
            case COORDINATOR -> demoteCoordinator(user.get(), day);
            default -> false;
        };
    }

    private boolean demoteGuide(User guide)
    {
        if(guide.isTrainee())
        {
            guide.setTrainee(true);
            userRepository.save(guide);
            return true;
        }
        return false;
    }

    private boolean demoteAdvisor(User advisor)
    {
        int bilkentId = advisor.getBilkentId();
        String username = advisor.getUsername();
        String email = advisor.getEmail();
        String phoneNo = advisor.getPhoneNo();
        String password = advisor.getPassword();
        DEPARTMENT department = advisor.getDepartment();
        List<ObjectId> logs = advisor.getLogs();
        List<ObjectId> suggestedEvents = advisor.getSuggestedEvents();
        boolean[] availability = advisor.getAvailability();

        userRepository.deleteById(advisor.getId());
        Optional<User> user=this.createUser(bilkentId, username, email, phoneNo, password, USER_STATUS.GUIDE, department, logs, suggestedEvents, false, availability, DAY.NOT_ASSIGNED);
        return user.isPresent();
    }

    private boolean demoteCoordinator(User coordinator, DAY day)
    {
        int bilkentId = coordinator.getBilkentId();
        String username = coordinator.getUsername();
        String email = coordinator.getEmail();
        String phoneNo = coordinator.getPhoneNo();
        String password = coordinator.getPassword();
        DEPARTMENT department = coordinator.getDepartment();
        List<ObjectId> logs = coordinator.getLogs();
        List<ObjectId> suggestedEvents = coordinator.getSuggestedEvents();
        boolean[] availability = coordinator.getAvailability();

        userRepository.deleteById(coordinator.getId());
        Optional<User> user=this.createUser(bilkentId, username, email, phoneNo, password, USER_STATUS.ADVISOR, department, logs, suggestedEvents, false, availability, day);
        return user.isPresent();
    }

    public boolean editUser(int bilkentId, String username, String email, String phoneNo)
    {
        Optional<User> optionalUser = userRepository.findByBilkentId(bilkentId);
        if(optionalUser.isEmpty())
        {
            return false;
        }
        User user = optionalUser.get();
        user.setUsername(username);
        user.setEmail(email);
        user.setPhoneNo(phoneNo);
        userRepository.save(user);
        return true;
    }

    public boolean shufflePassword(int bilkentId)
    {
        Optional<User> optionalUser = userRepository.findByBilkentId(bilkentId);
        if(optionalUser.isEmpty())
        {
            return false;
        }
        User user = optionalUser.get();

        int passwordLength = switch (user.getStatus())
        {
            case GUIDE -> User.DEFAULT_GUIDE_PASSWORD_LENGTH;
            case ADVISOR -> User.DEFAULT_ADVISOR_PASSWORD_LENGTH;
            case COORDINATOR -> User.DEFAULT_COORDINATOR_PASSWORD_LENGTH;
            case ACTING_DIRECTOR -> User.DEFAULT_ACTING_DIRECTOR_PASSWORD_LENGTH;
            default -> 8;
        };

        String password = UserManager.generatePassword(passwordLength);

        user.setPassword(passwordEncoder.encode(password));

        mailSenderService.sendEmail(user.getEmail(),"Your password has been changed.",
                "Your password is " + password + ". Change it as soon as possible.");

        userRepository.save(user);
        return true;
    }

}
