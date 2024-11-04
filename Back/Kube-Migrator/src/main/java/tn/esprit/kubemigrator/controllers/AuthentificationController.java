package tn.esprit.kubemigrator.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.kubemigrator.config.AuthenticationResponse;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.services.AuthentificationService;
import tn.esprit.kubemigrator.services.IEmailService;
import tn.esprit.kubemigrator.services.IUserService;

@RestController
@Slf4j
@CrossOrigin(origins = "*")
public class AuthentificationController {
    private final AuthentificationService authservice;
    private final IUserService userService;
    private final IEmailService emailService;

    public AuthentificationController(AuthentificationService authservice, IUserService userService, IEmailService emailService) {
        this.authservice = authservice;
        this.userService = userService;
        this.emailService = emailService;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authservice.register(request));

    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request
    ) {
        AuthenticationResponse authenticationResponse = authservice.authenticate(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @GetMapping("/session")
    public ResponseEntity<UserDto> getSession(@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(authservice.getSession(token));
    }
    @GetMapping("/reset-password/{email}")
    public User initiatePasswordReset(@PathVariable("email") String email) {
        User user = userService.findUserByEmail(email);
        if (user != null) {
            log.info(emailService.sendEmailPass(email, "Password Reset", user));
            return user;
        } else {
            return null;
        }
    }

}

