package bilfo.demo.schoolCollection;

import bilfo.demo.userCollection.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface SchoolRepository extends MongoRepository<School, ObjectId> {
    public Optional<School> findSchoolById(ObjectId id);
    public Optional<School> findSchoolByName(String name);
}
