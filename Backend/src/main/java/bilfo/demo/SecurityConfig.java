package bilfo.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig{

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.POST, "form/eva","/create", "/user/login", "/changeOwnUsername","/changeOwnEmail","/changeOwnPassword"
                                                                    ,"/form/hsform", "/form/indform", "/form/fairform", "/promoteUser", "/form/evaluate",
                                                                "/addGuide","/removeUser", "/addAdvisor", "/addCoordinator", "/addActingDirector",
                                                                "/changeAvailability", "/event/feedback", "/event/claimEvent", "/forgotPasswordMail",
                                                                "/forgotPasswordChangeRequest", "/demoteUser", "/log/addLog", "/log/deleteLog",
                                                                "/log/markLogAsPaid", "/log/markAllLogsAsPaid", "/dashboard/createDashboard", "/event/offerEvent").permitAll()
                        .requestMatchers(HttpMethod.GET,"/getGuides","/getAdvisors", "/event", "/form", "/getAvailability", "/getFeedback", "/getAdvisorsOfTheDay","/getUserInfo"
                                                                , "/event/getScheduleOfWeek","/form/getForms", "/event/getEvents", "/school/cityNames", "/school/districtNames", "/school/schoolNames",
                                                                  "/log/getLogs", "/log/getEventsOfUserThatDontHaveLogsAndFinished","/log/getAllGuidesLogTable", "/guidesAvailable").permitAll()
                        .anyRequest().authenticated()
                )
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }



}
