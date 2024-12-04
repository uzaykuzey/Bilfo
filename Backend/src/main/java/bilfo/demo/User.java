package bilfo.demo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    // Getters and Setters
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    private int bilkentId;
    private USER_STATUS status;
    private String username;
    private String email;
    private String password; // Store hashed passwords in real applications

}