package bilfo.demo.passwordCollection.eventPasswordCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Repository
public interface FormPasswordRepository extends MongoRepository<FormPassword, ObjectId> {
    public Optional<FormPassword> findByFormId(ObjectId formId);
    public void removeById(ObjectId formId);
    public List<FormPassword> findByContactMail(String contactMail);
    public List<FormPassword> findAll();
    public void deleteByFormId(ObjectId formId); // New method
}
