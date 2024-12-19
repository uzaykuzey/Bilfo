package bilfo.demo.passwordCollection.forgotPasswordCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForgotPasswordService {
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    public void saveForgotPassword(ForgotPassword forgotPassword) {
        forgotPasswordRepository.save(forgotPassword);
    }

    public void deleteForgotPassword(ForgotPassword forgotPassword) {
        forgotPasswordRepository.removeById(forgotPassword.getId());
    }

    public List<ForgotPassword> getForgotPasswordsByBilkentId(int bilkent) {
        return forgotPasswordRepository.findByBilkentId(bilkent);
    }

    @Scheduled(fixedRate = 900000)
    public void autoDeleteForgotPassword() {
        List<ForgotPassword> forgotPasswords = forgotPasswordRepository.findAll();
        for (ForgotPassword forgotPassword : forgotPasswords)
        {
            if(forgotPassword.flaggedForDestruction)
            {
                deleteForgotPassword(forgotPassword);
            }
            else
            {
                forgotPassword.flaggedForDestruction=true;
                forgotPasswordRepository.save(forgotPassword);
            }
        }
    }

}