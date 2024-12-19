package bilfo.demo.schoolCollection;
import bilfo.demo.enums.CITIES;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "schools")
@AllArgsConstructor
@NoArgsConstructor
public class School {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    private String name;
    private CITIES location;
    private int bilkentAdmissions;
}