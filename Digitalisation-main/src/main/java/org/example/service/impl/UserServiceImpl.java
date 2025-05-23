package org.example.service.impl;


import jakarta.transaction.Transactional;
import org.example.entity.Compagnie;
import org.example.entity.Role;
import org.example.entity.User;
import org.example.repository.RoleRepository;
import org.example.repository.UserRepository;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createCompanyAccount(String username, String roleName, Compagnie compagnie) {
        Role role = roleRepository.findByTypee(roleName);
        if (role == null) {
            throw new IllegalArgumentException("Role " + roleName + " not found.");
        }

        // Générer un mot de passe sécurisé pour la compagnie
        String password = generateSecurePassword();

        User utilisateur = new User();
        utilisateur.setUsername(username);
        utilisateur.setPassword(passwordEncoder.encode(password));
        utilisateur.setOwnerro(role);
        utilisateur.setOwnerus(compagnie);

        return repo.save(utilisateur);
    }

    private String generateSecurePassword() {
        // Vous pouvez utiliser une bibliothèque comme Spring Security pour générer un mot de passe sécurisé
        // Voici un exemple simple de génération de mot de passe aléatoire
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            int index = (int) (Math.random() * chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }

}
