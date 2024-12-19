package bilfo.demo.passwordCollection.forgotPasswordCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "forgot_passwords")
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPassword {
    @Id
    ObjectId id;
    @Indexed(unique = true)
    private String code;
    private int bilkentId;
    boolean flaggedForDestruction;
}