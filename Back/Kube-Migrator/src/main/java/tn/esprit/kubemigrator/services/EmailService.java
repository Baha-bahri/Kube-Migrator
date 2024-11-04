package tn.esprit.kubemigrator.services;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepUser;

import java.util.Random;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailService implements IEmailService {

    private final JavaMailSender javaMailSender;
    private final RepUser repUser;
    private final String sender;

    public EmailService(JavaMailSender javaMailSender, RepUser repUser, @Value("${spring.mail.username}") String sender) {
        this.javaMailSender = javaMailSender;
        this.repUser = repUser;
        this.sender = sender;
    }


    @Override
    public String sendEmailPass(String to, String subject, User user) {
        try {
            Random random = new Random();
            int randomWithNextInt = Math.abs(random.nextInt());
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            user.setPassword(passwordEncoder.encode(String.valueOf(randomWithNextInt)));

            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom("bahabahri22@gmail.com");
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Reset Password");
            mailMessage.setText("Your new password is: " + randomWithNextInt);

            javaMailSender.send(mailMessage);

            repUser.save(user);

            return "Mail Sent";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
