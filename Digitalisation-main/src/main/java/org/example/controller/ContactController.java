package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AbonnementDto;
import org.example.Dto.ContactDto;
import org.example.entity.Contact;
import org.example.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/contact")
@SecurityRequirement(name = "Keycloak")
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping("/save")
    private Long saveContact(@RequestBody Contact contact) {
        contactService.saveorUpdate(contact);
        return contact.getId();
    }


    @GetMapping("/getall")
    public List<ContactDto> getContacts() {
        return contactService.listAll().stream().map(ContactDto::toDto).collect(Collectors.toList());
    }

   /* @PutMapping("/edit/{id}")
    public ContactDto update(@RequestBody Contact contact, @PathVariable(name = "id") Long id) {
        contact.setId(id);
        contactService.saveorUpdate(contact);
        return ContactDto.toDto(contact);
    }*/

    /*@PutMapping("/removeCompany/{id}")
    public ResponseEntity<Void> removeCompanyFromContact(@PathVariable Long id) {
        contactService.removeCompagnieIdFromContact(id);
        return ResponseEntity.ok().build();
    }*/

    @PutMapping("/removeCompany/{id}")
    public ResponseEntity<Long> removeCompanyFromContact(@PathVariable Long id) {
        Long companyId = contactService.removeCompanyId(id);
        return ResponseEntity.ok(companyId);
    }

    @PutMapping("/rePartenariat/{id}")
    public ResponseEntity<Void> rePartenariatToContact(@PathVariable Long id) {
        contactService.rePartenariatContact(id);
        return ResponseEntity.ok().build();
    }






    @PutMapping("/edit/{id}")

    public ResponseEntity<ContactDto> updateContact(@PathVariable Long id, @RequestBody ContactDto contactDto) {
        ContactDto updatedContact = contactService.updateContact(id, contactDto);
        return ResponseEntity.ok(updatedContact);
    }
    @GetMapping("/getall/{compagnieId}")
    public List<ContactDto> getContactsByCompagnie(@PathVariable Long compagnieId) {
        return contactService.getContactsByCompagnie(compagnieId).stream().map(ContactDto::toDto).collect(Collectors.toList());
    }
    @DeleteMapping("/delete/{id}")
    public void deleteContact(@PathVariable("id") Long id) {
        contactService.deleteContact(id);
    }

    @GetMapping("/{id}")
    public ContactDto getContactById(@PathVariable(name = "id") Long contactId) {
        return ContactDto.toDto(contactService.getContactById(contactId));
    }


}
