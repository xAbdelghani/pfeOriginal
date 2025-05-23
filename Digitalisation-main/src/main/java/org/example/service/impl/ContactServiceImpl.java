package org.example.service.impl;

import org.example.Dto.AbonnementDto;
import org.example.Dto.ContactDto;
import org.example.entity.*;
import org.example.repository.CompagnieRepository;
import org.example.repository.ContactRepository;
import org.example.repository.FonctionRepository;
import org.example.service.ContactService;
import org.example.service.FonctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private FonctionRepository fonctionRepository;

    @Autowired
    private CompagnieRepository compagnieRepository;

    private Long temporaryCompanyId;

    @Override
    public void saveorUpdate(Contact contacts) {
        contactRepository.save(contacts);
    }
    @Override
    public List<Contact> listAll() {
        return contactRepository.findAll();
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    public ContactDto updateContact(Long id, ContactDto contactDto){
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(("Contact not found with id " +id)));
        contact.setNomc(contactDto.getNomc());
        contact.setPrenomc(contactDto.getPrenomc());
        contact.setEmailc(contactDto.getEmailc());
        contact.setFax(contactDto.getFax());
        contact.setTelephonec(contactDto.getTelephonec());
        contact.setRemarquec(contactDto.getRemarquec());

        // Vérifiez d'abord si contactDto.getFonctionDto() n'est pas null et que son ID n'est pas null avant d'accéder à l'ID
        if (contactDto.getFonctionDto() != null && contactDto.getFonctionDto().getId() != null) {
            Fonction fonction = fonctionRepository.findById(contactDto.getFonctionDto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fonction not found with id " + contactDto.getFonctionDto().getId()));
            contact.setOwnerfo(fonction);
        } else {
            // Gérez le cas où l'objet FonctionDto ou son ID est null
            // Ici, vous pouvez lever une exception, ignorer l'attribut fonction ou effectuer une autre logique selon vos besoins
        }

        contactRepository.save(contact);
        return ContactDto.toDto(contact);
    }




    @Override
    public List<Contact> getContactsByCompagnie(Long compagnieId) {
        return contactRepository.findByOwnercoId(compagnieId); // Utilisation de la méthode du dépôt
    }
    @Override
    public Contact getContactById(Long contactId) {
        return contactRepository.findById(contactId).orElse(null);
    }

    /*@Override
    public void removeCompagnieIdFromContact(Long id) {
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not found" + id));
        contact.setOwnerco(null);
        contactRepository.save(contact);
    }*/
    private Contact convertContactDtoToEntity(ContactDto contactDto) {
        Contact contact = new Contact();
        contact.setId(contactDto.getId());
        contact.setNomc(contactDto.getNomc());
        contact.setFax(contactDto.getFax());
        contact.setTelephonec(contactDto.getTelephonec());
        contact.setEmailc(contactDto.getEmailc());
        contact.setRemarquec(contactDto.getRemarquec());

        // Assurez-vous que les relations ManyToOne avec Compagnie et Fonction sont correctement définies dans votre entité Contact
        // Définissez les instances de Compagnie et Fonction en fonction des DTO ou des identifiants, selon la logique de votre application
        // Si les DTO sont complets (avec les objets CompagnieDto et FonctionDto), utilisez-les pour initialiser les relations

        // Sinon, utilisez uniquement les identifiants pour éviter la récursivité lors de la conversion
        if (contactDto.getCompagnieDto() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(contactDto.getCompagnieDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Compagnie si nécessaire
            contact.setOwnerco(compagnie);
        } else if (contactDto.getCompagnieId() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(contactDto.getCompagnieId());
            // Assurez-vous que l'objet Compagnie contient uniquement l'ID pour éviter la récursivité
            contact.setOwnerco(compagnie);
        }

        if (contactDto.getFonctionDto() != null) {
            // Initialisez la fonction en fonction du DTO
            Fonction fonction = new Fonction();
            fonction.setId(contactDto.getFonctionDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Fonction si nécessaire
            contact.setOwnerfo(fonction);
        }

        return contact;
    }

    @Override
    public Long removeCompanyId(Long id) {
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + id));
        if (contact.getOwnerco() != null) {
            temporaryCompanyId = contact.getOwnerco().getId();
            contact.setOwnerco(null);
            contactRepository.save(contact);
            return temporaryCompanyId;
        }
        return null;
    }

    @Override
    public void rePartenariatContact(Long contactId) {
        Contact contact = contactRepository.findById(contactId).orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + contactId));
        if (temporaryCompanyId != null) {
            Compagnie compagnie = compagnieRepository.findById(temporaryCompanyId).orElseThrow(() -> new ResourceNotFoundException("Compagnie not found with id " + temporaryCompanyId));
            contact.setOwnerco(compagnie);
            contactRepository.save(contact);
            temporaryCompanyId = null;
        }
    }

}
