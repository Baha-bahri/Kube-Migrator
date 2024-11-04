package tn.esprit.kubemigrator.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.kubemigrator.entities.Project;

public interface RepProject extends JpaRepository<Project, Long> {
    
}
