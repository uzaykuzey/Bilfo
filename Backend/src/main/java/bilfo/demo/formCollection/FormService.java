package bilfo.demo.formCollection;


import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.SchoolManager;
import bilfo.demo.Triple;
import bilfo.demo.enums.*;
import bilfo.demo.mailSender.MailSenderService;
import bilfo.demo.passwordCollection.eventPasswordCollection.FormPassword;
import bilfo.demo.passwordCollection.eventPasswordCollection.FormPasswordRepository;
import bilfo.demo.passwordCollection.eventPasswordCollection.FormPasswordService;
import bilfo.demo.userCollection.UserManager;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;


@Service
public class FormService {
    @Autowired
    private FormRepository formRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    @Lazy
    FormPasswordService formPasswordService;
    @Autowired
    @Lazy
    FormPasswordRepository formPasswordRepository;
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

        Date today = new Date();
        /*for(var pair : possibleDates)
        {
            if(pair.getFirst().before(today) || DAY.dayDifference(today, pair.getFirst()) < 14)
            {
                return Optional.empty();
            }
        }*/

        if(type!=EVENT_TYPES.INDIVIDUAL_TOUR)
        {
            if(!SchoolManager.getInstance().schoolExists(city, district, schoolName))
            {
                return Optional.empty();
            }
            var forms=formRepository.findAllByTypeAndApproved(type, FORM_STATES.ACCEPTED);
            forms.addAll(formRepository.findAllByTypeAndApproved(type, FORM_STATES.NOT_REVIEWED));
            var cityDistrictSchool= Triple.of(city, district, schoolName);
            for(Form form: forms)
            {
                if(form.getCityDistrictSchool().equals(cityDistrictSchool))
                {
                    return Optional.empty();
                }
            }
        }


        Form form;
        switch (type)
        {
            case FAIR -> form = new FairForm(new ObjectId(), today, approved, possibleDates, contactMail, city, district, schoolName);
            case INDIVIDUAL_TOUR -> form = new IndividualTourForm(new ObjectId(), today, approved, possibleDates, contactMail, visitorCount, visitorNotes, names, department);
            case HIGHSCHOOL_TOUR -> form = new HighSchoolTourForm(new ObjectId(), today, approved, possibleDates, contactMail, visitorCount, visitorNotes, schoolName, counselorEmail, city, district);
            default -> throw new IllegalArgumentException("Unknown EVENT_TYPE: " + type);
        }
        String password = UserManager.generatePassword(16);
        FormPassword formPassword = new FormPassword(new ObjectId(), form.getId(), form.getContactMail(), passwordEncoder.encode(password));
        mailSenderService.sendEmail(form.getContactMail(), "Bilkent Form Application", "Your event has been completed, you can give your feedback by using code:\n"+password);
        // Save the Form in the database
        Form savedForm = formRepository.save(form);
        logger.info("Form created successfully.");
        formPasswordService.saveFormPassword(formPassword);
        return Optional.of(savedForm);
    }

    public Optional<Event> evaluateForm(ObjectId formId, FORM_STATES state, Date chosenDate, TOUR_TIMES chosenTime, String rejectionMessage)
    {
        Optional<Form> form = formRepository.findById(formId);
        if (form.isEmpty() || form.get().getApproved() != FORM_STATES.NOT_REVIEWED) {
            return Optional.empty();
        }

        form.get().setApproved(state);
        formRepository.save(form.get());

        if(state==FORM_STATES.REJECTED)
        {
            mailSenderService.sendEmail(form.get().getContactMail(), "Your Form has been evaluated", "Your form has been rejected.\nReason:\n"+rejectionMessage);
            return Optional.empty();
        }
        mailSenderService.sendEmail(form.get().getContactMail(), "Your Form has been evaluated", "Your form has been accepted. \nAccepted time: "+chosenDate.toString().replace("00:00:00 TRT ", "")+" at "+chosenTime.toString());
        return eventService.createEvent(formId, new ArrayList<>(), new ArrayList<>(), form.get().getType(), chosenDate, chosenTime);
    }

    public List<FormWithStats> getForms(EVENT_TYPES type, FORM_STATES state, SORTING_TYPES sort)
    {
        List<Form> forms = formRepository.findAllByTypeAndApproved(type, state);
        switch (sort) {
            case BY_DATE_OF_FORM -> forms.sort(new Comparator<Form>() {
                                        @Override
                                        public int compare(Form o1, Form o2) {
                                            return o1.getDateOfForm().compareTo(o2.getDateOfForm());
                                        }
                                    });
            case BY_ADMISSIONS_TO_BILKENT -> forms.sort(new Comparator<Form>() {
                                                @Override
                                                public int compare(Form o1, Form o2) {
                                                    return -(o1.getBilkentAdmissions() - (o2.getBilkentAdmissions()));
                                                }
                                            });
            case BY_PERCENTAGE_OF_ADMISSIONS_TO_BILKENT -> forms.sort(new Comparator<Form>() {
                                                @Override
                                                public int compare(Form o1, Form o2) {
                                                    return -(o1.getPercentageOfBilkentAdmissions() - (o2.getPercentageOfBilkentAdmissions()));
                                                }
                                            });
        };

        List<FormWithStats> result = new ArrayList<>();
        for(Form form : forms)
        {
            if(form.getType()==EVENT_TYPES.INDIVIDUAL_TOUR)
            {
                result.add(new FormWithStats(form, 0, 0));
            }
            result.add(new FormWithStats(form, form.getBilkentAdmissions(), form.getPercentageOfBilkentAdmissions()));
        }
        return result;
    }

    public Pair<Optional<Form>,Optional<Event>> getDetailsFromPass(String password){
        List<FormPassword> passwords = formPasswordRepository.findAll();
        Optional<Form> form = Optional.empty();
        for(FormPassword formPassword: passwords){
            if(passwordEncoder.matches(password,formPassword.getHashedPassword())){
                form = formRepository.findFormById(formPassword.getFormId());
                break;
            }
        }
        if(form.isEmpty()){
            return null;
        }
        Optional<Event> event = Optional.empty();
        List<Event> allEvents = eventService.allEvents();
        for(Event currEvent : allEvents){
            if(currEvent.getOriginalForm().equals(form.get().getId())){
                event = Optional.of(currEvent);;
                break;
            }
        }
        return Pair.of(form,event);
    }

    @AllArgsConstructor
    public static class FormWithStats
    {
        public Form form;
        public int bilkentAdmissions;
        public int bilkentAdmissionsPercentage;
    }

    public boolean cancelByCounselor(String id){
        ObjectId formId = new ObjectId(id);
        Optional<Form> form = formRepository.findFormById(formId);
        if(form.isEmpty()){
            return false;
        }
        if(form.get().getApproved() == FORM_STATES.NOT_REVIEWED){
            formPasswordRepository.deleteByFormId(formId);
            formRepository.deleteById(formId);
        }
        return true;
    }

    public void deleteForm(Form form){
        formRepository.delete(form);
    }
}
