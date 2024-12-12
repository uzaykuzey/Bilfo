package bilfo.demo.formCollection;


import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.enums.*;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class FormService {
    @Autowired
    private FormRepository formRepository;
    private EventService eventService=EventService.getInstance();
    private static final Logger logger = LoggerFactory.getLogger(FormService.class);

    public List<Form> allForms(){
        return formRepository.findAll();
    }

    public Optional<Form> getForm(ObjectId id){
        return formRepository.findById(id);
    }

    public Optional<Form> createForm(EVENT_TYPES type, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleDates, CITIES city, String schoolName, int visitorCount, String visitorNotes, String counselorEmail, String[] names, DEPARTMENT department) {
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
            case FAIR -> form = new FairForm(new ObjectId(), approved, possibleDates, city, schoolName);
            case INDIVIDUAL_TOUR -> form = new IndividualTourForm(new ObjectId(), approved, possibleDates, visitorCount, visitorNotes, names, department);
            case HIGHSCHOOL_TOUR -> form = new HighSchoolTourForm(new ObjectId(), approved, possibleDates, visitorCount, visitorNotes, schoolName, counselorEmail, city);
            default -> throw new IllegalArgumentException("Unknown EVENT_TYPE: " + type);
        }

        // Save the Form in the database
        Form savedForm = formRepository.save(form);
        logger.info("Form created successfully.");

        return Optional.of(savedForm);
    }

    public Optional<Event> evaluateForm(ObjectId formId, FORM_STATES state, Date chosenDate, TOUR_TIMES chosenTime, String rejectionMessage)
    {
        Optional<Form> form = formRepository.findById(formId);
        if (!form.isPresent()) {
            return Optional.empty();
        }

        form.get().setApproved(state);
        formRepository.save(form.get());

        //TODO send mail
        if(state==FORM_STATES.REJECTED)
        {
            return Optional.empty();
        }

        return eventService.createEvent(formId, new ArrayList<>(), new ArrayList<>(), form.get().getType(), chosenDate, chosenTime);
    }

}
