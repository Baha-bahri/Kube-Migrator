package tn.esprit.kubemigrator.services;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.kubemigrator.config.AuthenticationResponse;
import tn.esprit.kubemigrator.config.InvalidCredentialsException;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Role;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepUser;
import org.springframework.security.authentication.AuthenticationManager;

@Service
public class AuthentificationService {
    private final RepUser repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authentficationManager;

    public AuthentificationService(RepUser repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authentficationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authentficationManager = authentficationManager;
    }

    public AuthenticationResponse register(User request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        repository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token,null,null);
    }
    public AuthenticationResponse authenticate(User request) {
        User user = repository.findByUsername(request.getUsername()).orElseThrow();
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user);
            String message = "Welcome, " + user.getUsername() + "!";

            return new AuthenticationResponse(token, user.getUsername(), message);
        } else {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }


    public UserDto getSession(String token)
    {
        token = token.replace("Bearer ","").trim();
        if(jwtService.isTokenExpired(token) || token.equals(""))
            return null;

        User user = repository.findByUsername(jwtService.extractUsername(token)).orElse(null);
        UserDto userDTO = new UserDto();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().toString());
        return userDTO;
    }

}

