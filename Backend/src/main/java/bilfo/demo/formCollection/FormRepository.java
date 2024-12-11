package bilfo.demo.formCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;


@Repository
public interface FormRepository extends MongoRepository<Form, ObjectId> {
    public Optional<Form> findFormById(ObjectId id);
    public List<Form> findAll();
}
