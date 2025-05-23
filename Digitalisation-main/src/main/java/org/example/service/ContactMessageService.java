package org.example.service;

import org.example.entity.ContactMessage;
import org.example.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageService {
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public ContactMessage saveContactMessage(ContactMessage message) {
        contactMessageRepository.save(message);
        System.out.println("Simulated saving message: " + message);
        return message;
    }
}
