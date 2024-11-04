package tn.esprit.kubemigrator.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.kubemigrator.entities.Velero;

public interface RepVelero extends JpaRepository<Velero, String> {
}
