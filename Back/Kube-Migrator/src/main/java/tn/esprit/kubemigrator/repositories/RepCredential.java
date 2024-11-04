package tn.esprit.kubemigrator.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.kubemigrator.entities.Credential;

public interface RepCredential extends JpaRepository<Credential, Long> {
}
