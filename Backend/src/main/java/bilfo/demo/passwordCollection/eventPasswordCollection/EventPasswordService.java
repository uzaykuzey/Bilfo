package bilfo.demo.passwordCollection.eventPasswordCollection;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventPasswordService {
    @Autowired
    private EventPasswordRepository eventPasswordRepository;

    public Optional<EventPassword> getEventPasswordWithEventId(ObjectId eventId) {
        return eventPasswordRepository.findByEventId(eventId);
    }

    public void saveEventPassword(EventPassword eventPassword) {
        eventPasswordRepository.save(eventPassword);
    }

    public void deleteEventPassword(EventPassword eventPassword) {
        eventPasswordRepository.removeById(eventPassword.getId());
    }

    public List<EventPassword> getEventPasswordsByContactMail(String contactMail) {
        return eventPasswordRepository.findByContactMail(contactMail);
    }

}