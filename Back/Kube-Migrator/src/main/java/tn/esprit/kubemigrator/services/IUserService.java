package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.entities.User;

import java.util.List;

public interface IUserService {
    List<User> getAllUsers();

    User getUserById(Long id);

    User saveUser(User user);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    User findUserByEmail(String email);
    User findUserByUsername(String username);
}
