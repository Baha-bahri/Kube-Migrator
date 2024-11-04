package tn.esprit.kubemigrator.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepUser;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    private final RepUser userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(RepUser userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        Optional<User> existingUserOptional = userRepository.findById(id);
        System.out.println("User =======> " + user);
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            if(user.getUsername() != null)
                existingUser.setUsername(user.getUsername());
            if(user.getEmail() != null)
                existingUser.setEmail(user.getEmail());
            if(user.getPhone() != null)
                existingUser.setPhone(user.getPhone());
            if(user.getPassword() != null && user.getPassword() != "")
            {
                System.out.println("password changed!");
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            System.out.println(existingUser);
            return userRepository.save(existingUser);
        } else {
            return null;
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public User findUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.orElse(null);
    }
}
