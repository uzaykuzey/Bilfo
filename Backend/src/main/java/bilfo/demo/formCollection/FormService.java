package bilfo.demo.formCollection;


import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.enums.*;
import bilfo.demo.mailSender.MailSenderService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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

    @Autowired
    @Lazy
    private EventService eventService;
    private static final Logger logger = LoggerFactory.getLogger(FormService.class);
    @Autowired
    private MailSenderService mailSenderService;

    public List<Form> allForms(){
        return formRepository.findAll();
    }

    public Optional<Form> getForm(ObjectId id){
        return formRepository.findById(id);
    }

    public Optional<Form> createForm(EVENT_TYPES type, FORM_STATES approved, List<Pair<Date, TOUR_TIMES>> possibleDates, String contactMail, String city, String district, String schoolName, int visitorCount, String visitorNotes, String counselorEmail, String[] names, DEPARTMENT department) {
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
            case FAIR -> form = new FairForm(new ObjectId(), approved, possibleDates, contactMail, city, district, schoolName);
            case INDIVIDUAL_TOUR -> form = new IndividualTourForm(new ObjectId(), approved, possibleDates, contactMail, visitorCount, visitorNotes, names, department);
            case HIGHSCHOOL_TOUR -> form = new HighSchoolTourForm(new ObjectId(), approved, possibleDates, contactMail, visitorCount, visitorNotes, schoolName, counselorEmail, city, district);
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

        if(state==FORM_STATES.REJECTED)
        {
            mailSenderService.sendEmail(form.get().getContactMail(), "Your Form has been evaluated", "Your form has been rejected.\nReason:\n"+rejectionMessage);
            return Optional.empty();
        }
        mailSenderService.sendEmail(form.get().getContactMail(), "Your Form has been evaluated", "Your form has been accepted. \nAccepted time: "+chosenDate.toString()+" at "+chosenTime.toString());
        return eventService.createEvent(formId, new ArrayList<>(), new ArrayList<>(), form.get().getType(), chosenDate, chosenTime);
    }

    public List<Form> getForms(EVENT_TYPES type, FORM_STATES state)
    {
        return formRepository.findAllByTypeAndApproved(type, state);
    }

}
