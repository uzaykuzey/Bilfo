package bilfo.demo.userCollection;

import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;

import java.util.List;

public class Advisor extends Guide {
    private DAY dayOfAdvisor;

    public Advisor(ObjectId id, int bilkentID, USER_STATUS status, String username, String email, String password, DEPARTMENT department, DAY dayOfAdvisor) {
        super(id, bilkentID, status, username, email, password, department);
        this.dayOfAdvisor = dayOfAdvisor;
    }

    public Advisor(ObjectId id, int bilkentID, USER_STATUS status, String username, String email, String password, DEPARTMENT department, List<ObjectId> logs, DAY dayOfAdvisor) {
        this(id, bilkentID, status, username, email, password, department, dayOfAdvisor);
        this.setLogs(logs);
    }

    public DAY getDayOfAdvisor() {
        return dayOfAdvisor;
    }
}