package bilfo.demo.dashboardCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardManager {
    
    @Autowired
    private DashboardService dashboardService;

    @PostMapping("/createDashboard")
    public Dashboard createDashboard(@RequestBody(required = false) Dashboard dashboard) {
        if (dashboard == null) {
            dashboard = new Dashboard();
        }
        return dashboardService.createDashboard(dashboard);
    }
}
