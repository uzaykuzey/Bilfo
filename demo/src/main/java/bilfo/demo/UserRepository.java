package bilfo.demo;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    public Optional<User> findByBilkentId(int bilkentId);
}
