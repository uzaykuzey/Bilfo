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

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

		SpringApplication.run(BilfoApplication.class, args);
	}
}
