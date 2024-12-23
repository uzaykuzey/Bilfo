package bilfo.demo.dashboard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardManager {
    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/getDashboard")
    public Dashboard getDashboard()
    {
        return dashboardService.getDashboard();
    }
}
