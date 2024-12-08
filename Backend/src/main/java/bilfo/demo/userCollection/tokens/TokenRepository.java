package bilfo.demo.userCollection.tokens;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@Repository
public interface TokenRepository extends MongoRepository<Token, ObjectId> {
    public Optional<Token> findByHashedToken(String hashedToken);
}
