package bilfo.demo.userCollection;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormManager;
import bilfo.demo.mailSender.MailSenderManager;
import bilfo.demo.security.jwt.JwtUtil;
import bilfo.demo.security.dto.LoginResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping
public class UserManager {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    @Lazy
    private MailSenderManager mailSenderManager;
    @Autowired
    private JwtUtil jwtUtil;
    @GetMapping
    public ResponseEntity<List<User>> allUsers(){
        return new ResponseEntity<List<User>>(userService.allUsers(),HttpStatus.OK);
    }


    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody Map<String, String> userRequest) {
        int bilkentId = Integer.parseInt(userRequest.get("bilkentId"));
        String username = userRequest.get("username");
        String email = userRequest.get("email");
        String phoneNo = userRequest.get("phoneNo");
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
        Optional<User> newUser = userService.createUser(bilkentId, username, email, phoneNo, password, status, department, new ArrayList<>(), new ArrayList<>(), trainee, new boolean[User.AVAILABILITY_LENGTH], day);

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        int userId = Integer.parseInt(loginRequest.get("userId"));
        String password = loginRequest.get("password");
        
        Optional<User> userOpt = userService.authenticate(userId, password);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = jwtUtil.generateToken(user);
            
            LoginResponse response = new LoginResponse(
                token,
                user.getBilkentId(),
                user.getStatus(),
                user.getUsername()
            );
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
        }
    }

    @PostMapping("/changeOwnUsername")
    public ResponseEntity<String> changeOwnUsername( @RequestBody Map<String,Object> changeUserRequest) {
        String username = (String) changeUserRequest.get("username");
        String password = (String) changeUserRequest.get("password");
        int id = Integer.parseInt(changeUserRequest.get("bilkentId").toString());
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
        int id = Integer.parseInt(changeUserRequest.get("bilkentId").toString());
        Optional<User> user = userService.authenticate(id,password);
        if (user.isPresent()) {
            userService.changeEmail(id,email);
            return new ResponseEntity<String>("Change Username successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    public boolean passwordStrongEnough(String password) {
        return password.length()>=8 && password.matches(".*[a-z].*") && password.matches(".*[A-Z].*") && password.matches(".*\\d.*") && password.matches(".*[^a-zA-Z0-9].*");
    }

    @PostMapping("/changeOwnPassword")
    public ResponseEntity<String> changeOwnPassword( @RequestBody Map<String,Object> changeUserRequest) {
        String newPassword = (String) changeUserRequest.get("newPassword");
        String oldPassword = (String) changeUserRequest.get("password");
        int id = Integer.parseInt(changeUserRequest.get("bilkentId").toString());

        if(!passwordStrongEnough(newPassword))
        {
            return new ResponseEntity<>("weak password", HttpStatus.BAD_REQUEST);
        }

        Optional<User> user = userService.authenticate(id,oldPassword);
        if (user.isPresent()) {
            String hashedPassword = passwordEncoder.encode(newPassword);
            userService.changePassword(id,hashedPassword);
            return new ResponseEntity<String>("Change Username successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/changePhoto")
    public ResponseEntity<String> changePhoto( @RequestBody Map<String,String> changePhotoRequest) {
        String newPhoto = changePhotoRequest.get("photo");
        int bilkentId = Integer.parseInt(changePhotoRequest.get("bilkentId"));
        userService.changePhoto(bilkentId, newPhoto);
        return new ResponseEntity<String>("Change Photo successful", HttpStatus.OK);
    }

    @PostMapping("/resetPhoto")
    public ResponseEntity<String> resetPhoto( @RequestBody Map<String,String> resetPhotoRequest) {
        int bilkentId = Integer.parseInt(resetPhotoRequest.get("bilkentId"));
        userService.changePhoto(bilkentId, User.DEFAULT_PHOTO);
        return new ResponseEntity<String>("Reset Photo successful", HttpStatus.OK);
    }

    @PostMapping("/changeAvailability")
    public ResponseEntity<String> changeAvailability(@RequestBody Map<String,String> changeUserRequest) {
        int bilkentId = Integer.parseInt(changeUserRequest.get("bilkentId"));
        String availabilityString = changeUserRequest.get("availabilityString");

        if(availabilityString==null || availabilityString.length() != User.AVAILABILITY_LENGTH)
        {
            return new ResponseEntity<>("Length of the availability string is invalid",HttpStatus.BAD_REQUEST);
        }

        boolean[] availabilityArray=new boolean[availabilityString.length()];

        for(int i=0; i<availabilityString.length(); i++)
        {
            availabilityArray[i] = availabilityString.charAt(i)=='1';
        }

        Optional<User> user = userService.getUser(bilkentId);
        if(user.isPresent()) {
            userService.changeAvailability(bilkentId, availabilityArray);
            return new ResponseEntity<>("Change availability successful", HttpStatus.OK);
        }

        return new ResponseEntity<>("No User", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getAvailability")
    public ResponseEntity<String> getAvailability(@RequestParam Map<String,String> userRequest)
    {
        int bilkentId = Integer.parseInt(userRequest.get("bilkentId"));
        Optional<User> user = userService.getUser(bilkentId);
        if (user.isEmpty()) {
            return new ResponseEntity<>("404", HttpStatus.NOT_FOUND);
        }

        boolean[] availabilityArray=user.get().getAvailability();
        StringBuilder availabilityString=new StringBuilder();
        for (boolean b : availabilityArray) {
            availabilityString.append(b ? "1" : "0");
        }
        return new ResponseEntity<String>(availabilityString.toString(), HttpStatus.OK);
    }

    @GetMapping("/getAdvisorsOfTheDay")
    public ResponseEntity<List<Advisor>> getAdvisorsOfTheDay()
    {
        return new ResponseEntity<>(userService.getAdvisorsOfTheDay(DAY.getCurrentDay()), HttpStatus.OK);
    }

    @GetMapping("/getUserInfo")
    public ResponseEntity<User> getUser(@RequestParam int bilkentId)
    {
        Optional<User> user=userService.getUser(bilkentId);
        return new ResponseEntity<>(user.orElse(null), user.isEmpty() ? HttpStatus.NOT_FOUND : HttpStatus.OK);
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

    @GetMapping("/getGuides")
    public ResponseEntity<List<User>> getGuideList() {
        Optional<List<User>> guides = userService.getGuides();
        if (guides.isPresent() && !guides.get().isEmpty()) {
            System.out.println(guides);
            return ResponseEntity.ok(guides.get()); // 200 OK with the guide list
        } else {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
    }

    @GetMapping("/getAdvisors")
    public ResponseEntity<List<User>> getAdvisorList(){
        Optional<List<User>> advisors = userService.getAdvisors();
        if (advisors.isPresent() && !advisors.get().isEmpty()) {
            return ResponseEntity.ok(advisors.get()); // 200 OK with the guide list
        } else {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
    }

    @PostMapping("/addGuide")
    public ResponseEntity<String> addGuide(@RequestBody Map<String,String> addGuideRequest)
    {
        String name = addGuideRequest.get("username");
        int bilkentId = Integer.parseInt(addGuideRequest.get("bilkentId"));
        String email = addGuideRequest.get("email");
        String phoneNo = addGuideRequest.get("phoneNo");
        boolean trainee = Boolean.parseBoolean(addGuideRequest.get("trainee"));
        DEPARTMENT department = DEPARTMENT.valueOf(addGuideRequest.get("department").toUpperCase());
        String tempPassword = generatePassword(User.DEFAULT_GUIDE_PASSWORD_LENGTH);
        Optional<User> user = userService.createUser(bilkentId, name, email, phoneNo, tempPassword, USER_STATUS.GUIDE, department, new ArrayList<>(), new ArrayList<>(), trainee, new boolean[User.AVAILABILITY_LENGTH], DAY.NOT_ASSIGNED);
        if(user.isPresent()) {
            mailSenderManager.sendEmail(email,"You are a new GUIDE!!!",
                    "Your password is " + tempPassword + ". Change it as soon as possible.");
            return new ResponseEntity<>("User added", HttpStatus.OK);
        }
        return new ResponseEntity<>("There is already a user with that id number", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/addAdvisor")
    public ResponseEntity<String> addAdvisor(@RequestBody Map<String,String> addAdvisorRequest)
    {
        String name = addAdvisorRequest.get("username");
        int bilkentId = Integer.parseInt(addAdvisorRequest.get("bilkentId"));
        String email = addAdvisorRequest.get("email");
        String phoneNo = addAdvisorRequest.get("phoneNo");
        DEPARTMENT department = DEPARTMENT.valueOf(addAdvisorRequest.get("department").toUpperCase());
        DAY day = DAY.valueOf(addAdvisorRequest.get("day").toUpperCase());
        String tempPassword = generatePassword(User.DEFAULT_ADVISOR_PASSWORD_LENGTH);
        Optional<User> user = userService.createUser(bilkentId, name, email, phoneNo, tempPassword, USER_STATUS.ADVISOR, department, new ArrayList<>(), new ArrayList<>(), false, new boolean[User.AVAILABILITY_LENGTH], day);
        if(user.isPresent()) {
            mailSenderManager.sendEmail(email,"You are a new ADVISOR!!!",
                                        "Your password is " + tempPassword + ". Change it as soon as possible.");
            return new ResponseEntity<>("User added", HttpStatus.OK);
        }
        return new ResponseEntity<>("There is already a user with that id number", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/addCoordinator")
    public ResponseEntity<String> addCoordinator(@RequestBody Map<String,String> addCoordinatorRequest)
    {
        String name = addCoordinatorRequest.get("username");
        int bilkentId = Integer.parseInt(addCoordinatorRequest.get("bilkentId"));
        String email = addCoordinatorRequest.get("email");
        String phoneNo = addCoordinatorRequest.get("phoneNo");
        DEPARTMENT department = DEPARTMENT.valueOf(addCoordinatorRequest.get("department").toUpperCase());
        String tempPassword = generatePassword(User.DEFAULT_COORDINATOR_PASSWORD_LENGTH);
        Optional<User> user = userService.createUser(bilkentId, name, email, phoneNo, tempPassword, USER_STATUS.COORDINATOR, department, new ArrayList<>(), new ArrayList<>(), false, new boolean[User.AVAILABILITY_LENGTH], DAY.NOT_ASSIGNED);
        if(user.isPresent()) {
            mailSenderManager.sendEmail(email,"You are a new COORDINATOR!!!",
                    "Your password is " + tempPassword + ". Change it as soon as possible.");
            return new ResponseEntity<>("User added", HttpStatus.OK);
        }
        return new ResponseEntity<>("There is already a user with that id number", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/addActingDirector")
    public ResponseEntity<String> addActingDirector(@RequestBody Map<String,String> addActingDirectorRequest)
    {
        String name = addActingDirectorRequest.get("username");
        int bilkentId = Integer.parseInt(addActingDirectorRequest.get("bilkentId"));
        String email = addActingDirectorRequest.get("email");
        String phoneNo = addActingDirectorRequest.get("phoneNo");
        String tempPassword = generatePassword(User.DEFAULT_ACTING_DIRECTOR_PASSWORD_LENGTH);
        Optional<User> user = userService.createUser(bilkentId, name, email, phoneNo, tempPassword, USER_STATUS.ACTING_DIRECTOR, DEPARTMENT.NOT_APPLICABLE, new ArrayList<>(), new ArrayList<>(), false, new boolean[User.AVAILABILITY_LENGTH], DAY.NOT_ASSIGNED);
        if(user.isPresent()) {
            mailSenderManager.sendEmail(email,"You are a new COORDINATOR!!!",
                    "Your password is " + tempPassword + ". Change it as soon as possible.");
            return new ResponseEntity<>("User added", HttpStatus.OK);
        }
        return new ResponseEntity<>("There is already a user with that id number", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/removeUser")
    public ResponseEntity<String> removeUser(@RequestBody Map<String,String> removedUserId) {
        int userId = Integer.parseInt(removedUserId.get("bilkentId"));
        boolean deletion = userService.removeUser(userId);
        if (deletion) {
            return new ResponseEntity<String>("Successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Error Occurred", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/demoteUser")
    public ResponseEntity<String> demoteUser(@RequestBody Map<String,String> demoteRequest) {
        int bilkentId = Integer.parseInt(demoteRequest.get("bilkentId"));
        DAY day=DAY.NOT_ASSIGNED;
        if(demoteRequest.containsKey("day"))
        {
            day=DAY.valueOf(demoteRequest.get("day").toUpperCase());
        }
        if(userService.demote(bilkentId, day))
        {
            return new ResponseEntity<>("successful demotion!", HttpStatus.OK);
        }
        return new ResponseEntity<>("user can't be demoted", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/editUser")
    public ResponseEntity<String> editUser(@RequestBody Map<String,String> editUserRequest) {
        int bilkentId = Integer.parseInt(editUserRequest.get("bilkentId"));
        String username = editUserRequest.get("username");
        String email = editUserRequest.get("email");
        String phoneNo = editUserRequest.get("phoneNo");

        if(userService.editUser(bilkentId, username, email, phoneNo))
        {
            return new ResponseEntity<>("successful editing!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Error Occurred", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody int bilkentId) {
        if(userService.resetPassword(bilkentId))
        {
            return new ResponseEntity<>("successful shuffling!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Error Occurred", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/forgotPasswordMail")
    public ResponseEntity<String> forgotPasswordMail(@RequestBody Map<String,String> forgotPasswordMailRequest) {
        int bilkentId = Integer.parseInt(forgotPasswordMailRequest.get("bilkentId"));

        if(userService.forgotPasswordMail(bilkentId))
        {
            return new ResponseEntity<>("successful forgot password!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Error Occurred", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/forgotPasswordChangeRequest")
    public ResponseEntity<String> forgotPasswordChangeRequest(@RequestBody Map<String,String> forgotPasswordChangeRequest) {
        int bilkentId = Integer.parseInt(forgotPasswordChangeRequest.get("bilkentId"));
        String newPassword = forgotPasswordChangeRequest.get("newPassword");
        String forgotPassword = forgotPasswordChangeRequest.get("forgotPassword");
        if(passwordStrongEnough(newPassword))
        {
            return new ResponseEntity<>("weak password", HttpStatus.BAD_REQUEST);
        }
        if(userService.forgotPasswordChangeRequest(bilkentId, newPassword, forgotPassword))
        {
            return new ResponseEntity<>("successful forgot password!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Error Occurred", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/guidesAvailable")
    public ResponseEntity<List<User>> getAvailableGuides(@RequestParam Map<String,String> dateOfTour){
        String date = dateOfTour.get("date");
        int index1 = Integer.parseInt(dateOfTour.get("index1"));
        int index2 = Integer.parseInt(dateOfTour.get("index2"));
        int index3 = Integer.parseInt(dateOfTour.get("index3"));
        int[] indexes = new int[]{index1, index2, index3};
        ObjectId eventId = new ObjectId(dateOfTour.get("eventId"));
        List<User> availableGuides = userService.getAvailableGuides(date, indexes,eventId);

        return new ResponseEntity<List<User>>(availableGuides,HttpStatus.OK);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }

    public static String generatePassword(int length) {
        String upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String specialCharacters = "!@#$^*-_";
        String allCharacters = upperCaseLetters + lowerCaseLetters + digits + specialCharacters;

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(upperCaseLetters.charAt(random.nextInt(upperCaseLetters.length())));
        password.append(lowerCaseLetters.charAt(random.nextInt(lowerCaseLetters.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(specialCharacters.charAt(random.nextInt(specialCharacters.length())));

        for (int i = 4; i < length; i++) {
            password.append(allCharacters.charAt(random.nextInt(allCharacters.length())));
        }

        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }

        return new String(passwordArray);
    }

}