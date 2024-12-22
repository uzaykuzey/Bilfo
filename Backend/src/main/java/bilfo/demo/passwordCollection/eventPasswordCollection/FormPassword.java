package bilfo.demo.passwordCollection.eventPasswordCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "form_passwords")
@AllArgsConstructor
@NoArgsConstructor
public class FormPassword {
    @Id
    ObjectId id;
    @Indexed(unique = true)
    private ObjectId formId;
    private String contactMail;
    private String hashedPassword;
}