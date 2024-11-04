package tn.esprit.kubemigrator.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Project implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long project_id;
    String project_name;

    @ManyToOne
    @JoinColumn(name = "credential_id")
    Credential credential;

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    List<Backup> backups;

    @ManyToOne
    @JoinColumn(name = "velero_version")
    Velero velero;
}
