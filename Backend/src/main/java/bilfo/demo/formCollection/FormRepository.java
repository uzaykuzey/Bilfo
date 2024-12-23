package bilfo.demo.formCollection;

import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
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

    List<Form> findAllByTypeAndApproved(EVENT_TYPES type, FORM_STATES approved);    
    List<Form> findAllByType(FORM_STATES state);
    void deleteById(ObjectId id);
}
