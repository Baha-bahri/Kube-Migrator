package tn.esprit.kubemigrator.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.kubemigrator.repositories.RepUser;
@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private final RepUser repuser;

    public UserDetailsServiceImp(RepUser repuser) {
        this.repuser = repuser;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repuser.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
    }
}
