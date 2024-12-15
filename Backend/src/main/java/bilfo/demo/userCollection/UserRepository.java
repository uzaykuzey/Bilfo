package bilfo.demo.userCollection;

import bilfo.demo.enums.USER_STATUS;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    public Optional<User> findByBilkentId(int bilkentId);
    public Optional<User> findById(ObjectId id);
    public Optional<List<User>> findUsersByStatus(USER_STATUS status);
    public List<User> findAll();
}
