package bilfo.demo.userCollection;


import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.TypeAlias;

import java.util.ArrayList;
import java.util.List;

@TypeAlias("guide")
public class Guide extends User{

    public Guide(ObjectId id, int bilkentId, USER_STATUS status, String username, String email, String phoneNo, String password, DEPARTMENT department, List<ObjectId> logs, List<ObjectId> suggestedEvents, boolean trainee, boolean[] availability, String photo) {
        super(id, bilkentId, status, username, email, phoneNo, password, department, logs, suggestedEvents, trainee, availability, photo);
    }

}
