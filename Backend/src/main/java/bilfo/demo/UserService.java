package bilfo.demo;


import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public Optional<User> createUser(int bilkentId, String username, String email, String password, USER_STATUS status, DEPARTMENT department) {
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
        User newUser = new User(new ObjectId(), bilkentId, status, username, email, hashedPassword, department);

        // Save the user in the database
        User savedUser = userRepository.save(newUser);
        logger.info("User with ID {} created successfully.", bilkentId);

        return Optional.of(savedUser);
    }

    public Optional<User> authenticate(int bilkentId, String password){

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
}
