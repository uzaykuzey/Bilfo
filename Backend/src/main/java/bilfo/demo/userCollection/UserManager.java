package bilfo.demo.userCollection;

import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
public class UserManager {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
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

        // Attempt to create the user
        Optional<User> newUser = userService.createUser(bilkentId, username, email, password, status, department);

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
            return new ResponseEntity<String>("Login successful", HttpStatus.OK);
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

}


