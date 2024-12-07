package bilfo.demo.formCollection;


import bilfo.demo.enums.DEPARTMENT;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.TOUR_TIMES;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class FormService {
    @Autowired
    private FormRepository formRepository;
    private static final Logger logger = LoggerFactory.getLogger(FormService.class);

    public List<Form> allForms(){
        return formRepository.findAll();
    }

    public Optional<Form> getForm(ObjectId id){
        return formRepository.findById(id);
    }

    public Optional<Form> createForm(EVENT_TYPES type, boolean approved, List<Pair<Date, TOUR_TIMES>> possibleDates, String location, ObjectId schoolId, int visitorCount, String visitorNotes, ObjectId counselorId, String[] names, DEPARTMENT department) {
        logger.info("Creating Form");

        // Check if Form already exists
        //TODO
        /*Optional<Form> existingUser = FormRepository.findFormById(id);
        if (existingUser.isPresent()) {
            logger.warn("Form with ID {} already exists. User creation failed.", id);
            return Optional.empty();
        }*/

        Form form = new Form();
        switch (type)
        {
            case FAIR -> form = new FairForm(new ObjectId(), approved, possibleDates, location, schoolId);
            case INDIVIDUAL_TOUR -> form = new IndividualTourForm(new ObjectId(), approved, possibleDates, visitorCount, visitorNotes, names, department);
            case HIGHSCHOOL_TOUR -> form = new HighSchoolTourForm(new ObjectId(), approved, possibleDates, visitorCount, visitorNotes, schoolId, counselorId);
            default -> throw new IllegalArgumentException("Unknown EVENT_TYPE: " + type);
        }

        // Save the Form in the database
        Form savedForm = formRepository.save(form);
        logger.info("Form created successfully.");

        return Optional.of(savedForm);
    }
}
