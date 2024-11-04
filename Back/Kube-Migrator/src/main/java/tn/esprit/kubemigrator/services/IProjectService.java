package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Project;

import java.util.List;

public interface    IProjectService {
    List<Project> getAllProjects(UserDto userDto);

    Project getProjectById(Long id);

    Project saveProject(Project project, long id_credential, String velero_version);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);
    Project assignBackupToProject(Long projectId, Long backupId);

    Project assignCredentialToProject(Long projectId, Long credentialId);

    List<Project> getAll();
}
