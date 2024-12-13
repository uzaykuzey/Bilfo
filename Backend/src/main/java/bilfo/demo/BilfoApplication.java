package bilfo.demo;

import bilfo.demo.mailSender.MailSenderService;
import bilfo.demo.userCollection.UserManager;
import bilfo.demo.userCollection.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BilfoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BilfoApplication.class, args);
	}


}
