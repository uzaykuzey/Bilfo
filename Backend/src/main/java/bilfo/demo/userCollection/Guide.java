package bilfo.demo.userCollection;


import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class Guide extends User{

    public Guide(ObjectId id, int bilkentID, USER_STATUS status, String username, String email, String password, DEPARTMENT department, List<ObjectId> logs, List<ObjectId> suggestedEvents, boolean trainee, boolean[] availability) {
        super(id, bilkentID, status, username, email, password, department, logs, suggestedEvents, trainee, availability);
    }

}
