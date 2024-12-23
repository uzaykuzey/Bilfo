package bilfo.demo.passwordCollection.eventPasswordCollection;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FormPasswordService {
    @Autowired
    private FormPasswordRepository formPasswordRepository;

    public Optional<FormPassword> getFormPasswordWithEventId(ObjectId formId) {
        return formPasswordRepository.findByFormId(formId);
    }

    public void saveFormPassword(FormPassword formPassword) {
        formPasswordRepository.save(formPassword);
    }

    public void deleteFormPassword(FormPassword formPassword) {
        formPasswordRepository.removeById(formPassword.getId());
    }

    public List<FormPassword> getFormPasswordsByContactMail(String contactMail) {
        return formPasswordRepository.findByContactMail(contactMail);
    }


}