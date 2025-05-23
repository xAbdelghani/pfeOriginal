package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.Dto.CompagnieDto;
import org.example.Dto.FonctionDto;
import org.example.entity.Compagnie;
import org.example.entity.Contact;
import org.example.entity.Fonction;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactDto {
    private Long id;
    private String nomc;
    private String prenomc;
    private String fax;
    private String telephonec;
    private String emailc;
    private String remarquec;
    private CompagnieDto compagnieDto;
    private FonctionDto fonctionDto;
    private String raison_social;
    private Long compagnieId;
    private String qualite;
    private Long fonctionId;

    public static ContactDto toDto(Contact contact) {
        ContactDto.ContactDtoBuilder builder = ContactDto.builder()
                .id(contact.getId())
                .nomc(contact.getNomc())
                .fax(contact.getFax())
                .telephonec(contact.getTelephonec())
                .emailc(contact.getEmailc())
                .prenomc(contact.getPrenomc())
                .remarquec(contact.getRemarquec())
                .qualite(contact.getOwnerfo() != null ? contact.getOwnerfo().getQualite() :null)
                .raison_social(contact.getOwnerco() != null ? contact.getOwnerco().getRaisonSocial() : null);
               // .qualite(contact.getOwnerfo().getQualite());


        /*if (contact.getOwnerco() != null) {
            builder.compagnieDto(CompagnieDto.toDto(contact.getOwnerco()));
            builder.compagnieId(contact.getOwnerco().getId());
        }*/

        if (contact.getOwnerfo() != null) {
            builder.fonctionDto(FonctionDto.toDto(contact.getOwnerfo()));
        }
        if (contact.getOwnerco() != null) {
            builder.compagnieId(contact.getOwnerco().getId()); // Only reference ID to avoid recursion
        }

        if (contact.getOwnerfo() != null) {
            builder.fonctionId(contact.getOwnerfo().getId()); // Only reference ID to avoid recursion
        }



        return builder.build();
    }

    public static Contact convertContactDtoToEntity(ContactDto contactDto) {
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
            Fonction fonction = FonctionDto.convertFonctionDtoToEntity(contactDto.getFonctionDto());
            contact.setOwnerfo(fonction);
        }

        return contact;
    }

}
