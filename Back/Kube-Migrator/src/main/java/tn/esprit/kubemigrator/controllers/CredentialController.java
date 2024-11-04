package tn.esprit.kubemigrator.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Credential;
import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.services.AuthentificationService;
import tn.esprit.kubemigrator.services.ICredentialService;

import java.util.List;

@RestController
@RequestMapping("/credentials")
@CrossOrigin(origins = "*")
public class CredentialController {

    private final ICredentialService credentialService;
    private final AuthentificationService authentificationService;

    @Autowired
    public CredentialController(ICredentialService credentialService, AuthentificationService authentificationService) {
        this.credentialService = credentialService;
        this.authentificationService = authentificationService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<Credential> getCredentialById(@PathVariable("id") Long id) {
        Credential credential = credentialService.getCredentialById(id);
        if (credential != null) {
            return ResponseEntity.ok(credential);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Credential>> getAllCredentials(@RequestHeader("Authorization") String token) {
        UserDto userDto = authentificationService.getSession(token);
        List<Credential> credentials = credentialService.getAllCredentials(userDto);
        return ResponseEntity.ok(credentials);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Credential>> getAll() {
        List<Credential> credentials = credentialService.getAll();
        return ResponseEntity.ok(credentials);
    }
    @PostMapping("/{username}")
    public ResponseEntity<Credential> createCredential(@RequestBody Credential credential, @PathVariable("username") String username) {
        Credential createdCredential = credentialService.saveCredential(credential, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCredential);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Credential> updateCredential(@PathVariable("id") Long id, @RequestBody Credential credential) {
        Credential updatedCredential = credentialService.updateCredential(id, credential);
        if (updatedCredential != null) {
            return ResponseEntity.ok(updatedCredential);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredential(@PathVariable("id") Long id) {
        credentialService.deleteCredential(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getProjectsByCredential(@PathVariable("id") Long id) {
        Credential credential = credentialService.getCredentialById(id);
        if (credential != null) {
            return ResponseEntity.ok(credential.getProjects());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
