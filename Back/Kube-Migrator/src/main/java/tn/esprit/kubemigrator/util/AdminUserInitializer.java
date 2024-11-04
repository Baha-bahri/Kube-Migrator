package tn.esprit.kubemigrator.util;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tn.esprit.kubemigrator.entities.Role;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepUser;
import java.util.List;

@Component
@AllArgsConstructor
public class AdminUserInitializer {


    private final RepUser userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @PostConstruct
    public void init() {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        if (admins.isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(passwordEncoder.encode("admin1234"));
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
        } else {
            System.out.println("Admin user already exists!");
        }
    }
}

