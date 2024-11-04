package tn.esprit.kubemigrator.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.entities.Velero;
import tn.esprit.kubemigrator.repositories.RepProject;
import tn.esprit.kubemigrator.repositories.RepVelero;

import java.util.List;
import java.util.Optional;

@Service
public class VeleroService implements IVeleroService {

    private final RepVelero veleroRepository;
    private  final RepProject projectRepository;
    @Autowired
    public VeleroService(RepVelero veleroRepository,RepProject projectRepository) {
        this.veleroRepository = veleroRepository;
        this.projectRepository=projectRepository;
    }

    @Override
    public List<Velero> getAllVeleros() {
        return veleroRepository.findAll();
    }

    @Override
    public Velero getVeleroByVersion(String version) {
        Optional<Velero> veleroOptional = veleroRepository.findById(version);
        return veleroOptional.orElse(null);
    }

    @Override
    public Velero saveVelero(Velero velero) {
        return veleroRepository.save(velero);
    }

    @Override
    public Velero updateVelero(String version, Velero velero) {
        Optional<Velero> existingVeleroOptional = veleroRepository.findById(version);
        if (existingVeleroOptional.isPresent()) {
            Velero existingVelero = existingVeleroOptional.get();
            existingVelero.setVelero_bin(velero.getVelero_bin());

            return veleroRepository.save(existingVelero);
        } else {
            return null;
        }
    }

    @Override
     public void deleteVelero(String version) {
        veleroRepository.deleteById(version);
    }
}
