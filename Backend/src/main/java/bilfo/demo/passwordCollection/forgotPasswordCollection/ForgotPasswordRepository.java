package bilfo.demo.passwordCollection.forgotPasswordCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface ForgotPasswordRepository extends MongoRepository<ForgotPassword, ObjectId> {
    public void removeById(ObjectId eventId);
    public List<ForgotPassword> findAllByBilkentId(int bilkentId);
}
