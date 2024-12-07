package bilfo.demo.counselorCollection;

import bilfo.demo.schoolCollection.School;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface CounselorRepository extends MongoRepository<Counselor, ObjectId> {
    public Optional<Counselor> findCounselorById(ObjectId id);
}
