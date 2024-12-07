package bilfo.demo.userCollection;

import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
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
        System.out.println("zort");
        int userId = Integer.parseInt(loginRequest.get("userId"));
        String password = loginRequest.get("password");
        System.out.println("zort");
        // Authenticate the user
        Optional<User> user = userService.authenticate(userId, password);

        if (user.isPresent()) {
            // You can return a JWT token or any other response after successful login
            return new ResponseEntity<String>("Login successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }
}


