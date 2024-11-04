package tn.esprit.kubemigrator.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.services.AuthentificationService;
import tn.esprit.kubemigrator.services.IProjectService;

import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final IProjectService projectService;

    private final AuthentificationService authentificationService;

    @Autowired
    public ProjectController(IProjectService projectService, AuthentificationService authentificationService) {
        this.projectService = projectService;
        this.authentificationService = authentificationService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@RequestHeader("Authorization") String token) {
        UserDto userDto = authentificationService.getSession(token);
        List<Project> projects = projectService.getAllProjects(userDto);
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Project>> getAll() {
        List<Project> projects = projectService.getAll();
        return ResponseEntity.ok(projects);
    }


    @PostMapping("/{id_credential}/{velero_version}")
    public ResponseEntity<Project> createProject(@RequestBody Project project,
                                                 @PathVariable("id_credential") Long id_credential,
                                                 @PathVariable("velero_version") String velero_version) {
        Project createdProject = projectService.saveProject(project, id_credential, velero_version);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable("id") Long id, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable("id") Long id) {
        Project project = projectService.getProjectById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{projectId}/backups/{backupId}")
    public ResponseEntity<Project> assignBackupToProject(@PathVariable("projectId") Long projectId, @PathVariable("backupId") Long backupId) {
        Project project = projectService.assignBackupToProject(projectId, backupId);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/{projectId}/credentials/{credentialId}")
    public ResponseEntity<Project> assignCredentialToProject(@PathVariable("projectId") Long projectId, @PathVariable("credentialId") Long credentialId) {
        Project project = projectService.assignCredentialToProject(projectId, credentialId);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
