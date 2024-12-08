package bilfo.demo.userCollection.tokens;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tokens")
@AllArgsConstructor
@NoArgsConstructor
public class Token {
    @Id
    private ObjectId id;
    @Indexed
    private String hashedToken;
    private int userId;
}