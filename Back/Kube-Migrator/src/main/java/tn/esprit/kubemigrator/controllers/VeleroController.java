package tn.esprit.kubemigrator.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.kubemigrator.entities.Velero;
import tn.esprit.kubemigrator.services.IVeleroService;
import java.util.List;

@RestController
@RequestMapping("/veleros")
@CrossOrigin(origins = "*")
public class VeleroController {

    private final IVeleroService veleroService;
    @Autowired
    public VeleroController(IVeleroService veleroService ) {
        this.veleroService = veleroService;
    }

    @GetMapping
    public ResponseEntity<List<Velero>> getAllVeleros() {
        List<Velero> veleros = veleroService.getAllVeleros();
        return ResponseEntity.ok(veleros);
    }

    @GetMapping("/{version}")
    public ResponseEntity<Velero> getVeleroByVersion(@PathVariable("version") String version) {
        Velero velero = veleroService.getVeleroByVersion(version);
        if (velero != null) {
            return ResponseEntity.ok(velero);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Velero> createVelero(@RequestBody Velero velero) {
        Velero createdVelero = veleroService.saveVelero(velero);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVelero);
    }

    @PutMapping("/{version}")
    public ResponseEntity<Velero> updateVelero(@PathVariable("version") String version, @RequestBody Velero velero) {
        Velero updatedVelero = veleroService.updateVelero(version, velero);
        if (updatedVelero != null) {
            return ResponseEntity.ok(updatedVelero);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{version}")
    public ResponseEntity<Void> deleteVelero(@PathVariable("version") String version) {
        veleroService.deleteVelero(version);
        return ResponseEntity.noContent().build();
    }
}
