package bilfo.demo.mailSender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailSenderManager {

    @Autowired
    private MailSenderService mailSenderService;

    @GetMapping("/sendEmail")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {
        mailSenderService.sendEmail(to, subject, body);
        return "Email sent successfully!";
    }
}
