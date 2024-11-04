package tn.esprit.kubemigrator.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Backup;
import tn.esprit.kubemigrator.entities.Credential;
import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepBackup;
import tn.esprit.kubemigrator.repositories.RepProject;
import tn.esprit.kubemigrator.repositories.RepUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BackupService implements IBackupService {
    

    private final RepBackup backupRepository;
    private final RepUser repUser;
    private final RepProject projectRepository;

    @Autowired
    public BackupService(RepBackup backupRepository, RepUser repUser, RepProject projectRepository) {
        this.backupRepository = backupRepository;
        this.repUser= repUser;
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Backup> getAllBackups(UserDto userDto) {
        User user = repUser.findByUsername(userDto.getUsername()).orElse(null);
        if (user != null) {
            List<Credential> credentials = user.getCredentials();
            List<Backup> allBackups = new ArrayList<>();
            for (Credential credential : credentials) {
                allBackups.addAll(credential.getProjects().stream().flatMap(project -> project.getBackups().stream()).collect(Collectors.toList()));
            }
            return allBackups;
        } else {
            return null;
        }
    }

    @Override
    public Backup getBackupById(Long id) {
        Optional<Backup> backupOptional = backupRepository.findById(id);
        return backupOptional.orElse(null);
    }

    public Backup saveBackup(Backup backup, Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            backup.setProject(project);
            return backupRepository.save(backup);
        } else {
            return null;
        }
    }



@Override
    public Backup updateBackup(Long id, Backup backup) {
        Optional<Backup> existingBackupOptional = backupRepository.findById(id);
        if (existingBackupOptional.isPresent()) {
            Backup existingBackup = existingBackupOptional.get();
            existingBackup.setBack_name(backup.getBack_name());
            existingBackup.setNamespace_name(backup.getNamespace_name());


            return backupRepository.save(existingBackup);
        } else {
            return null;
        }
    }


    @Override
    public void deleteBackup(Long id) {
        backupRepository.deleteById(id);
    }

    @Override
    public List<Backup> getAll() {
        return backupRepository.findAll();
    }

}