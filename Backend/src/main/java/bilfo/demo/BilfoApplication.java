package bilfo.demo;

import bilfo.demo.mailSender.MailSenderService;
import bilfo.demo.userCollection.UserManager;
import bilfo.demo.userCollection.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@SpringBootApplication
@EnableScheduling
@RestController
public class BilfoApplication {
	public static void main(String[] args) {
		long startTime = System.currentTimeMillis(); // Record the start time
		SchoolManager.getInstance().readSchoolFile("/highschools.txt");
		long endTime = System.currentTimeMillis(); // Record the end time
		long duration = endTime - startTime; // Calculate the elapsed time
		System.out.println("Execution time: " + duration + " milliseconds");

		System.out.println(Arrays.toString(SchoolManager.getInstance().getCityNames()));
		System.out.println(Arrays.toString(SchoolManager.getInstance().getDistrictNames("İSTANBUL")));
		System.out.println(Arrays.toString(SchoolManager.getInstance().getSchoolNames("İSTANBUL", "ÜMRANİYE")));
		SpringApplication.run(BilfoApplication.class, args);
	}
}
