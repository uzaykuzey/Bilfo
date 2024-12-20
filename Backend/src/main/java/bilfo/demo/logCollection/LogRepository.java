package bilfo.demo.logCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface LogRepository extends MongoRepository<Log, ObjectId> {
    public Optional<Log> findLogById(ObjectId id);
}