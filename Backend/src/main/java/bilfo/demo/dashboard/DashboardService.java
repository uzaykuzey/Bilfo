package bilfo.demo.dashboard;

import bilfo.demo.EventCollection.Event;
import bilfo.demo.EventCollection.EventService;
import bilfo.demo.SchoolManager;
import bilfo.demo.enums.EVENT_STATES;
import bilfo.demo.enums.EVENT_TYPES;
import bilfo.demo.enums.FORM_STATES;
import bilfo.demo.formCollection.Form;
import bilfo.demo.formCollection.FormRepository;
import bilfo.demo.formCollection.HighSchoolTourForm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private EventService eventService;
    
    @Autowired
    private FormRepository formRepository;
    
    private final SchoolManager schoolManager = SchoolManager.getInstance();

    public Dashboard getDashboard() {
        // Calculate all dashboard data
        Map<String, Map<String, Integer>> dashboardData = getDashboardData();
        Dashboard dashboard=new Dashboard();

        // Populate the dashboard with calculated data
        dashboard.setCityDistribution(dashboardData.get("cityDistribution"));
        dashboard.setFormDistribution(dashboardData.get("formDistribution"));
        dashboard.setWeeklySchedule(dashboardData.get("weeklySchedule"));
        dashboard.setTourStats(dashboardData.get("tourStats"));

        return dashboard;
    }

    private Map<String, Map<String, Integer>> getDashboardData() {
        Map<String, Map<String, Integer>> dashboardData = new HashMap<>();
        
        // Get city distribution data
        Map<String, Integer> cityDistribution = calculateCityDistribution();
        dashboardData.put("cityDistribution", cityDistribution);

        // Get form status distribution
        Map<String, Integer> formDistribution = calculateFormDistribution();
        dashboardData.put("formDistribution", formDistribution);

        // Get weekly schedule statistics
        Map<String, Integer> weeklySchedule = calculateWeeklySchedule();
        dashboardData.put("weeklySchedule", weeklySchedule);

        // Get tour statistics
        Map<String, Integer> tourStats = calculateTourStatistics();
        dashboardData.put("tourStats", tourStats);

        return dashboardData;
    }

    private Map<String, Integer> calculateCityDistribution() {
        HashMap<String, Integer> cityCount = new LinkedHashMap<>();

        // Count forms by city for high school tours
        List<HighSchoolTourForm> highSchoolForms = formRepository
        .findAllByTypeAndApproved(EVENT_TYPES.HIGHSCHOOL_TOUR, FORM_STATES.ACCEPTED)
        .stream()
        .map(form -> (HighSchoolTourForm) form)  // Cast each Form to HSTourForm
        .collect(Collectors.toList());


        for (HighSchoolTourForm form : highSchoolForms) {
            String city = form.getCity();
            cityCount.put(city, cityCount.containsKey(city) ? cityCount.get(city) + 1 : 1);
        }

        return cityCount;
    }

    private Map<String, Integer> calculateFormDistribution() {
        Map<String, Integer> formStats = new HashMap<>();
        formStats.put("pending", 0);
        formStats.put("accepted", 0);
        formStats.put("rejected", 0);

        // Count forms by state for all types at once since they all follow the same pattern
        List<Form> pendingForms = formRepository.findAllByApproved(FORM_STATES.NOT_REVIEWED);
        List<Form> acceptedForms = formRepository.findAllByApproved(FORM_STATES.ACCEPTED);
        List<Form> rejectedForms = formRepository.findAllByApproved(FORM_STATES.REJECTED);

        formStats.put("pending", pendingForms.size());
        formStats.put("accepted", acceptedForms.size());
        formStats.put("rejected", rejectedForms.size());

        return formStats;
    }

    private Map<String, Integer> calculateWeeklySchedule() {
        Map<String, Integer> schedule = new LinkedHashMap<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        Arrays.asList(days).forEach(day -> schedule.put(day, 0));

        // Get current week's start and end dates
        LocalDate now = LocalDate.now();
        LocalDate weekStart = now.with(DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(6);

        // Convert to Date for your existing API
        Date startDate = Date.from(weekStart.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(weekEnd.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<Event> weekEvents = eventService.getEventRepository().findEventsByDateBetween(startDate, endDate);

        for (Event event : weekEvents) {
            if (event.getState() != EVENT_STATES.CANCELLED) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(event.getDate());
                String dayName = days[cal.get(Calendar.DAY_OF_WEEK) - 1];
                schedule.merge(dayName, 1, Integer::sum);
            }
        }

        return schedule;
    }

    private Map<String, Integer> calculateTourStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        
        // Since events only exist for accepted forms, we can use event states directly
        List<Pair<Event, Form>> completedEvents = eventService.getEvents(EVENT_STATES.COMPLETED);
        List<Pair<Event, Form>> cancelledEvents = eventService.getEvents(EVENT_STATES.CANCELLED);
        List<Pair<Event, Form>> ongoingEvents = eventService.getEvents(EVENT_STATES.ONGOING);

        // Calculate totals
        int completedTours = completedEvents.size();
        int cancelledTours = cancelledEvents.size();
        int ongoingTours = ongoingEvents.size();
        
        // Total tours is the same as total accepted forms
        int totalTours = completedTours + cancelledTours + ongoingTours;

        // Pending forms (not yet accepted or rejected)
        int pendingForms = formRepository.findAllByApproved(FORM_STATES.NOT_REVIEWED).size();

        stats.put("total", totalTours);
        stats.put("completed", completedTours);
        stats.put("cancelled", cancelledTours);
        stats.put("ongoing", ongoingTours);
        stats.put("pending", pendingForms);

        return stats;
    }
}
