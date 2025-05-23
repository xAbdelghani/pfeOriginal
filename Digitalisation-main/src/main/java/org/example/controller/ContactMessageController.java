package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.entity.ContactMessage;
import org.example.service.ContactMessageService;
import org.example.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contacts")
@SecurityRequirement(name = "Keycloak")
public class ContactMessageController {
    @Autowired
    private ContactMessageService contactMessageService;



    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<ContactMessage> createContactMessage(@RequestBody ContactMessage message) {
        // Sauvegarder le message dans la base de données
        ContactMessage savedMessage = contactMessageService.saveContactMessage(message);

        // Envoyer un email avec les détails du message
        String emailContent = String.format("Vous avez reçu un nouveau message de : %s\nEmail: %s\nMessage: %s",
                message.getName(), message.getEmail(), message.getMessage());
        emailService.sendEmail("sossey.kaoutar@gmail.com", "Nouveau Message de Contact", emailContent);

        return ResponseEntity.ok(savedMessage);
    }
}
