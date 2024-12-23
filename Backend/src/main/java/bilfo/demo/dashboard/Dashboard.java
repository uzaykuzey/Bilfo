package bilfo.demo.dashboard;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Data
public class Dashboard {
    @Id
    private ObjectId id;

    private Map<String, Integer> cityDistribution;
    private Map<String, Integer> formDistribution;
    private Map<String, Integer> weeklySchedule;
    private Map<String, Integer> tourStats;
    
    private Date createdAt;

    // Constructor
    public Dashboard() {
        this.createdAt = new Date();
    }

    // Custom getters for specific statistics
    public int getTotalTours() {
        return tourStats != null ? tourStats.getOrDefault("total", 0) : 0;
    }

    public int getCompletedTours() {
        return tourStats != null ? tourStats.getOrDefault("completed", 0) : 0;
    }

    public int getPendingForms() {
        return formDistribution != null ? formDistribution.getOrDefault("pending", 0) : 0;
    }

    public int getAcceptedForms() {
        return formDistribution != null ? formDistribution.getOrDefault("accepted", 0) : 0;
    }

    // Utility method to check if dashboard data is populated
    public boolean isPopulated() {
        return cityDistribution != null && 
               formDistribution != null && 
               weeklySchedule != null && 
               tourStats != null;
    }
} 