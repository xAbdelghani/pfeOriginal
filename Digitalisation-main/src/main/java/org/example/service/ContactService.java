package org.example.service;

import org.example.Dto.ContactDto;
import org.example.entity.Contact;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContactService {
    void saveorUpdate(Contact contacts);
    List<Contact> listAll();
    void deleteContact(Long id);
    Contact getContactById(Long contactId);

    List<Contact> getContactsByCompagnie(Long compagnieId);

    ContactDto updateContact(Long id, ContactDto contactDto);

   // void removeCompagnieIdFromContact(Long id);

    void rePartenariatContact(Long id);
    Long removeCompanyId(Long id);


}
