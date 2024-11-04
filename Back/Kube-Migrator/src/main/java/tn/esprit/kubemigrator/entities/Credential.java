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
public class Credential implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id_cred;
    String cred_name;
    String azure_backup_ressource_group;
    String azure_storage_account_id;
    String blob_container;
    String account_access_key;
    String azure_cloud_name;

    @OneToMany(mappedBy = "credential",cascade = CascadeType.ALL)
    @JsonIgnore
    List<Project> projects;
}