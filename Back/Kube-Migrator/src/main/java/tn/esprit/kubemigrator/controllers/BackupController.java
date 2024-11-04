package tn.esprit.kubemigrator.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Backup;
import tn.esprit.kubemigrator.services.AuthentificationService;
import tn.esprit.kubemigrator.services.IBackupService;

import java.util.List;

@RestController
@RequestMapping("/backups")
@CrossOrigin(origins = "*")
public class BackupController {

    private final IBackupService backupService;
     private final AuthentificationService authentificationService;
     


    @Autowired
    public BackupController(IBackupService backupService, AuthentificationService authentificationService) {
        this.backupService = backupService;
        this.authentificationService = authentificationService;
    }

    @GetMapping
    public ResponseEntity<List<Backup>> getAllBackups(@RequestHeader("Authorization") String token) {
        UserDto userDto = authentificationService.getSession(token);
        List<Backup> backups = backupService.getAllBackups(userDto);
        return ResponseEntity.ok(backups);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Backup>> getAll() {
        List<Backup> backups = backupService.getAll();
        return ResponseEntity.ok(backups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Backup> getBackupById(@PathVariable("id") Long id) {
        Backup backup = backupService.getBackupById(id);
        if (backup != null) {
            return ResponseEntity.ok(backup);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Backup> createBackup(@RequestBody Backup backup, @PathVariable("projectId") Long projectId) {
        Backup createdBackup = backupService.saveBackup(backup, projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBackup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Backup> updateBackup(@PathVariable("id") Long id, @RequestBody Backup backup) {
        Backup updatedBackup = backupService.updateBackup(id, backup);
        if (updatedBackup != null) {
            return ResponseEntity.ok(updatedBackup);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBackup(@PathVariable("id") Long id) {
        backupService.deleteBackup(id);
        return ResponseEntity.noContent().build();
    }
}
