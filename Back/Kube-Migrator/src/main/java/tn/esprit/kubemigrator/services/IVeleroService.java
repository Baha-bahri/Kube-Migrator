package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.entities.Velero;

import java.util.List;

public interface IVeleroService {
    List<Velero> getAllVeleros();

    Velero getVeleroByVersion(String version);

    Velero saveVelero(Velero velero);

    Velero updateVelero(String version, Velero velero);

    void deleteVelero(String version);
}
