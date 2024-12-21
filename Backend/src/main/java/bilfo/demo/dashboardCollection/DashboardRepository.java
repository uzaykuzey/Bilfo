package bilfo.demo.dashboardCollection;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DashboardRepository extends MongoRepository<Dashboard, ObjectId> {
    Optional<Dashboard> findDashboardById(ObjectId id);
} 