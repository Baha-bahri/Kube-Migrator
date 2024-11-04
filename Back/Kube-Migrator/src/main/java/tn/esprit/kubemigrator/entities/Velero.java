package tn.esprit.kubemigrator.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Velero implements Serializable {
    @Id
    String velero_version;
    String velero_bin;
    String velero_url;
    String velero_pkg;
    String velero_pkg_bin;
    String velero_pkg_ext;

      @OneToMany(mappedBy = "velero",cascade = CascadeType.ALL)
    @JsonIgnore
    List<Project> projects;
}
