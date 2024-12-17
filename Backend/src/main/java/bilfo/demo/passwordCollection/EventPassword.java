package bilfo.demo.passwordCollection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "event_passwords")
@AllArgsConstructor
@NoArgsConstructor
public class EventPassword {

}