package bilfo.demo.userCollection;

import bilfo.demo.enums.DAY;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

import java.time.DayOfWeek;
import java.util.List;

@Getter
@Setter
public class Advisor extends Guide {
    private DAY dayOfAdvisor;

    public Advisor(ObjectId id, int bilkentId, USER_STATUS status, String username, String email, String password, DEPARTMENT department, List<ObjectId> logs, List<ObjectId> suggestedEvents, boolean[] availability, DAY dayOfAdvisor) {
        super(id, bilkentId, status, username, email, password, department, logs, suggestedEvents, false, availability);
        this.dayOfAdvisor = dayOfAdvisor;
    }
}