package tn.esprit.kubemigrator.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "velero_backup")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Backup implements Serializable {
    @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long back_id;
    String back_name;
    String namespace_name;
    String deploy;
    String pv;
    String pvc;
    String key_backup;
    String value;

    @ManyToOne
    Project project;


}
