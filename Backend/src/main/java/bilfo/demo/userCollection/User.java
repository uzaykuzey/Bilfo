package bilfo.demo.userCollection;
import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.USER_STATUS;
import bilfo.demo.logCollection.Log;
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
public abstract class User {
    // Getters and Setters
    @Id
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
    private boolean[] availability;

    private void setId(int bilkentId) throws IllegalAccessException
    {
        throw new IllegalAccessException("Cannot modify id of a user");
    }
}
