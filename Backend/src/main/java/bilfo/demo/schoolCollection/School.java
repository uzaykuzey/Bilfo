package bilfo.demo.schoolCollection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "schools")
@AllArgsConstructor
@NoArgsConstructor
public class School {
    @Id
    private ObjectId id;

    private String name;
    private String location;
    private ObjectId counselorId;
}