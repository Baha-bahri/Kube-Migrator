package tn.esprit.kubemigrator.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Backup;
import tn.esprit.kubemigrator.entities.Credential;
import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.entities.Velero;
import tn.esprit.kubemigrator.repositories.RepBackup;
import tn.esprit.kubemigrator.repositories.RepCredential;
import tn.esprit.kubemigrator.repositories.RepProject;
import tn.esprit.kubemigrator.repositories.RepUser;
import tn.esprit.kubemigrator.repositories.RepVelero;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService implements IProjectService {

    private final RepProject projectRepository;
    private final RepBackup backupRepository;
    private final RepCredential credentialRepository;
    private final RepUser repUser;
     private final RepVelero veleroRepository;

    @Autowired
    public ProjectService(RepProject projectRepository, RepBackup backupRepository, RepCredential credentialRepository, RepUser repUser,RepVelero veleroRepository) {
        this.projectRepository = projectRepository;
        this.backupRepository = backupRepository;
        this.credentialRepository = credentialRepository;
        this.repUser = repUser;
        this.veleroRepository=veleroRepository;
    }

    @Override
    public List<Project> getAllProjects(UserDto userDto) {
        User user = repUser.findByUsername(userDto.getUsername()).orElse(null);
        if (user != null) {
            List<Project> projects = new ArrayList<>();
            user.getCredentials().stream().flatMap(credential -> credential.getProjects().stream()).forEach(projects::add);
            return projects;
        }
        return null;
    }

    @Override
    public Project getProjectById(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        return projectOptional.orElse(null);
    }

       @Override
    public Project saveProject(Project project, long id_credential, String velero_version) {
        Credential credential = credentialRepository.findById(id_credential).orElse(null);
        Velero velero = veleroRepository.findById(velero_version).orElse(null);
        if (credential != null && velero != null) {
            project.setCredential(credential);
            project.setVelero(velero);
            project = projectRepository.save(project);
            credential.getProjects().add(project);
            credentialRepository.save(credential);
        }
        return project;
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Optional<Project> existingProjectOptional = projectRepository.findById(id);
        if (existingProjectOptional.isPresent()) {
            Project existingProject = existingProjectOptional.get();
            existingProject.setProject_name(project.getProject_name());
            return projectRepository.save(existingProject);
        } else {
            return null;
        }
    }

    @Transactional
    public void deleteProject(Long projectId) {
        backupRepository.deleteByProjectProjectId(projectId);
        projectRepository.deleteById(projectId);
    }

    @Override
    public Project assignBackupToProject(Long projectId, Long backupId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        Backup backup = backupRepository.findById(backupId).orElse(null);
        if (project != null && backup != null) {
            backup.setProject(project);
            project.getBackups().add(backup);
            backupRepository.save(backup);
        }
        return project;
    }

    @Override
    public Project assignCredentialToProject(Long projectId, Long credentialId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        Credential credential = credentialRepository.findById(credentialId).orElse(null);
        if (project != null && credential != null) {
            project.setCredential(credential);
            credential.getProjects().add(project);
            credentialRepository.save(credential);
            projectRepository.save(project);
        }
        return project;
    }

    @Override
    public List<Project> getAll() {
        return projectRepository.findAll();
    }
}
