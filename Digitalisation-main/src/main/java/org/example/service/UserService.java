package org.example.service;

import org.example.entity.Compagnie;
import org.example.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User createCompanyAccount(String username, String roleName, Compagnie compagnie);
}
