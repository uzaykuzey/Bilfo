package bilfo.demo.userCollection;
import bilfo.demo.ObjectIdSerializer;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.logCollection.Log;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "user")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    // Getters and Setters
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    @Indexed(unique = true)
    private int bilkentId;
    private USER_STATUS status;
    private String username;
    private String email;
    private String phoneNo;
    private String password; // Store hashed passwords
    private DEPARTMENT department;
    private List<ObjectId> logs;
    private List<ObjectId> suggestedEvents;
    private boolean trainee;
    private boolean[] availability; //true means available, false means unavailable
    private String photo;

    public final static int AVAILABILITY_LENGTH = 77;
    public final static int DEFAULT_GUIDE_PASSWORD_LENGTH = 8;
    public final static int DEFAULT_ADVISOR_PASSWORD_LENGTH = 12;
    public final static int DEFAULT_COORDINATOR_PASSWORD_LENGTH = 14;
    public final static int DEFAULT_ACTING_DIRECTOR_PASSWORD_LENGTH = 16;
    public final static String DEFAULT_PHOTO = "";

    private void setId(int bilkentId) throws IllegalAccessException
    {
        throw new IllegalAccessException("Cannot modify id of a user");
    }
}
