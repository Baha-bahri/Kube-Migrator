package tn.esprit.kubemigrator.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import tn.esprit.kubemigrator.entities.Backup;



public interface RepBackup extends JpaRepository<Backup, Long> {
@Modifying
@Query("DELETE FROM Backup b WHERE b.project.project_id = :projectId")
void deleteByProjectProjectId(Long projectId);
}
