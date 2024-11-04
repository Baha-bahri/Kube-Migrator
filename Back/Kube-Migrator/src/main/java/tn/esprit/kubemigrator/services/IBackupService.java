package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Backup;

import java.util.List;

public interface IBackupService {
    List<Backup> getAllBackups(UserDto userDto);
    Backup getBackupById(Long id);
    Backup saveBackup(Backup backup, Long projectId);
    Backup updateBackup(Long id, Backup backup);
    void deleteBackup(Long id);
    List<Backup> getAll();
}
