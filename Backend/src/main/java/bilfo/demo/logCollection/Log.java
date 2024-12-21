package bilfo.demo.logCollection;

import bilfo.demo.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "logs")
@AllArgsConstructor
@NoArgsConstructor
public class Log {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId id;
    private double hours;
    private Date date;
    private ObjectId eventId;
    private boolean paid;
}