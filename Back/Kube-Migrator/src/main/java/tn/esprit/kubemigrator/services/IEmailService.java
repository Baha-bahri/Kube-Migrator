package tn.esprit.kubemigrator.services;

import tn.esprit.kubemigrator.entities.User;

public interface IEmailService {
    String sendEmailPass(String to, String subject, User user);
}
