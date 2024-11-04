package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Credential;

import java.util.List;

public interface ICredentialService {
    List<Credential> getAllCredentials(UserDto userDto);

    Credential getCredentialById(Long id);

    Credential saveCredential(Credential credential,String username);

    Credential updateCredential(Long id, Credential credential);

    void deleteCredential(Long id);

    List<Credential> getAll();
}
