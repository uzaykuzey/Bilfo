package bilfo.demo.counselorCollection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "counselors")
@AllArgsConstructor
@NoArgsConstructor
public class Counselor {
    @Id
    private ObjectId id;

    private String name;
    @Indexed(unique = true)
    private String email;
    private String phoneNo;
    private String schoolName;
}