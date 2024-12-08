package bilfo.demo.userCollection;

import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.userCollection.tokens.Token;
import bilfo.demo.userCollection.tokens.TokenRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping
public class UserManager {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenRepository tokenRepository;

    @GetMapping
    public ResponseEntity<List<User>> allUsers(){
        return new ResponseEntity<List<User>>(userService.allUsers(),HttpStatus.OK);
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody Map<String, String> userRequest) {
        int bilkentId = Integer.parseInt(userRequest.get("bilkentId"));
        String username = userRequest.get("username");
        String email = userRequest.get("email");
        String password = userRequest.get("password");
        USER_STATUS status = USER_STATUS.valueOf(userRequest.get("status").toUpperCase());
        DEPARTMENT department = DEPARTMENT.valueOf(userRequest.get("department").toUpperCase());

        DAY day = DAY.NOT_ASSIGNED;
        boolean trainee = false;
        if(status != USER_STATUS.GUIDE)
        {
            day = DAY.valueOf(userRequest.get("dayOfAdvisor").toUpperCase());
        }
        else
        {
            trainee = Boolean.parseBoolean(userRequest.get("trainee"));
        }
        // Attempt to create the user
        Optional<User> newUser = userService.createUser(bilkentId, username, email, password, status, department, new ArrayList<>(), new ArrayList<>(), trainee, new boolean[77], day);

        if (newUser.isPresent()) {
            return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("User creation failed. User with ID already exists.", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/login/{id}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable ObjectId id){
        return new ResponseEntity<Optional<User>>(userService.getUser(id),HttpStatus.OK);
    }


    @PostMapping("/user/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
        int userId = Integer.parseInt(loginRequest.get("userId"));
        String password = loginRequest.get("password");
        // Authenticate the user
        Optional<User> user = userService.authenticate(userId, password);

        if (user.isPresent()) {
            // You can return a JWT token or any other response after successful login
            SecureRandom secureRandom = new SecureRandom();
            Base64.Encoder base64Encoder = Base64.getUrlEncoder();

            byte[] randomBytes = new byte[64];
            secureRandom.nextBytes(randomBytes);
            String token = base64Encoder.encodeToString(randomBytes);

            tokenRepository.save(new Token(new ObjectId(), passwordEncoder.encode(token), userId));

            return new ResponseEntity<String>(token, HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/changeOwnUsername")
    public ResponseEntity<String> changeOwnUsername( @RequestBody Map<String,Object> changeUserRequest) {
        String username = (String) changeUserRequest.get("username");
        String password = (String) changeUserRequest.get("password");
        int id = Integer.parseInt(changeUserRequest.get("id").toString());
        Optional<User> user = userService.authenticate(id,password);
        if (user.isPresent()) {
            userService.changeUsername(id,username);
            return new ResponseEntity<String>("Change Username successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/changeOwnEmail")
    public ResponseEntity<String> changeOwnEmail( @RequestBody Map<String,Object> changeUserRequest) {
        String email = (String) changeUserRequest.get("email");
        String password = (String) changeUserRequest.get("password");
        int id = Integer.parseInt(changeUserRequest.get("id").toString());
        Optional<User> user = userService.authenticate(id,password);
        if (user.isPresent()) {
            userService.changeEmail(id,email);
            return new ResponseEntity<String>("Change Username successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/changeOwnPassword")
    public ResponseEntity<String> changeOwnPassword( @RequestBody Map<String,Object> changeUserRequest) {
        String newPassword = (String) changeUserRequest.get("newPassword");
        String oldPassword = (String) changeUserRequest.get("password");
        int id = Integer.parseInt(changeUserRequest.get("id").toString());
        Optional<User> user = userService.authenticate(id,oldPassword);
        if (user.isPresent()) {
            String hashedPassword = passwordEncoder.encode(newPassword);
            userService.changePassword(id,hashedPassword);
            return new ResponseEntity<String>("Change Username successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/changeAvailability")
    public ResponseEntity<String> changeAvailability(@RequestBody Map<String,String> changeUserRequest) {
        int id = Integer.parseInt(changeUserRequest.get("id"));
        int slot = Integer.parseInt(changeUserRequest.get("slot"));
        boolean availability = Boolean.parseBoolean(changeUserRequest.get("availability"));

        Optional<User> user = userService.getUser(id);
        if(user.isPresent()) {
            userService.changeAvailability(id, slot, availability);
            return new ResponseEntity<String>("Change availability successful", HttpStatus.OK);
        }
        return new ResponseEntity<String>("No User", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/getAdvisorsOfTheDay")
    public ResponseEntity<List<Advisor>> getAdvisorsOfTheDay()
    {
        return new ResponseEntity<>(userService.getAdvisorsOfTheDay(getCurrentDay()), HttpStatus.OK);
    }

    private DAY getCurrentDay() {
        return switch (LocalDate.now().getDayOfWeek()) {
            case MONDAY -> DAY.MONDAY;
            case TUESDAY -> DAY.TUESDAY;
            case WEDNESDAY -> DAY.WEDNESDAY;
            case THURSDAY -> DAY.THURSDAY;
            case FRIDAY -> DAY.FRIDAY;
            case SATURDAY -> DAY.SATURDAY;
            case SUNDAY -> DAY.SUNDAY;
        };
    }

    @PostMapping("/promoteUser")
    public ResponseEntity<String> promoteUser(@RequestBody Map<String,String> promoteRequest) {
        int bilkentId = Integer.parseInt(promoteRequest.get("bilkentId"));
        DAY day=DAY.NOT_ASSIGNED;
        if(promoteRequest.containsKey("day"))
        {
            day=DAY.valueOf(promoteRequest.get("day").toUpperCase());
        }
        if(userService.promote(bilkentId, day))
        {
            return new ResponseEntity<>("successful promotion!", HttpStatus.OK);
        }
        return new ResponseEntity<>("user can't be promoted", HttpStatus.BAD_REQUEST);
    }
}


