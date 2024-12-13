package bilfo.demo.mailSender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSenderService {
    
    @Autowired
    private JavaMailSender mailSender;

    public MailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String adress, String subject, String body) {
        
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom("bilfosystem@gmail.com");
        message.setTo(adress);
        message.setText(body);
        message.setSubject(subject);
        
        mailSender.send(message);
    }
}
