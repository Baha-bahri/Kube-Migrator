package tn.esprit.kubemigrator.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.kubemigrator.dto.UserDto;
import tn.esprit.kubemigrator.entities.Credential;
import tn.esprit.kubemigrator.entities.User;
import tn.esprit.kubemigrator.repositories.RepCredential;
import tn.esprit.kubemigrator.repositories.RepUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CredentialService implements ICredentialService{

    private final RepCredential credentialRepository;
    private final PasswordEncoder passwordEncoder;

    private final RepUser repUser;
    public CredentialService(RepCredential credentialRepository, RepUser repUser,PasswordEncoder passwordEncoder) {
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.repUser = repUser;
    }


    @Override
    public List<Credential> getAllCredentials(UserDto userDto) {
     User user = repUser.findByUsername(userDto.getUsername()).orElse(null);
        return user.getCredentials();
    }

    @Override
    public Credential getCredentialById(Long id) {
        Optional<Credential> credentialOptional = credentialRepository.findById(id);
        return credentialOptional.orElse(null);
    }

    @Override
    public Credential saveCredential(Credential credential,String username) {
        User user = repUser.findByUsername(username).orElse(null);

        if(user != null)
        {
            credential.setAccount_access_key(passwordEncoder.encode(credential.getAccount_access_key()));
            credential = credentialRepository.save(credential);
            if(user.getCredentials() == null)
            user.setCredentials(new ArrayList<>());
            user.getCredentials().add(credential);
            repUser.save(user);
        }
        return credential;
    }

    @Override
    public Credential updateCredential(Long id, Credential credential) {
        Optional<Credential> existingCredentialOptional = credentialRepository.findById(id);
        if (existingCredentialOptional.isPresent()) {
            Credential existingCredential = existingCredentialOptional.get();
            existingCredential.setAzure_backup_ressource_group(credential.getAzure_backup_ressource_group());
            existingCredential.setAzure_storage_account_id(credential.getAzure_storage_account_id());

            return credentialRepository.save(existingCredential);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCredential(Long id) {
        User user = repUser.getUserByCredentialId(id).orElse(null);
        if(user != null)
        {
            for(int i =0;i< user.getCredentials().size();i++)
            {
                if(user.getCredentials().get(i).getId_cred() == id)
                user.getCredentials().remove(i);
            }
            repUser.save(user);
        credentialRepository.deleteById(id);
        }
    }


    @Override
    public List<Credential> getAll() {
        return credentialRepository.findAll();
    }
}
