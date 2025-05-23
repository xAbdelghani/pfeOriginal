package org.example.Dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompagnieDto {

    private Long id;

    private String nom;

    private String raison_social;

    private String adresse;

    private String telephone;

    private String email;

    private String statut;

    private String password;
    private BigDecimal soldeCompagnie = BigDecimal.ZERO;

    private List<AbonnementDto> abonnement;

    private List<AttestationDto> attestationDto;

    private List<FactureDto> factureDto;

    private List<ContactDto> contactDto;

    private List<SoldePrepayeDto> soldePrepayeDto;

    private List<AgenceDto> agenceDto;

    private List<PointventeDto> pointventeDto;

    private List<RelationPointventeCompagnieDto> relationPointventeCompagnieDto;

    private List<AttestationsAutoriseesDto> attestationsAutoriseesDto;

  public static CompagnieDto toDto(Compagnie compagnie) {
      return CompagnieDto.builder()
              .id(compagnie.getId())
              .nom(compagnie.getNom())
              .raison_social(compagnie.getRaisonSocial())
              .adresse(compagnie.getAdresse())
              .telephone(compagnie.getTelephone())
              .email(compagnie.getEmail())
              .statut(compagnie.getStatut())
              .password(compagnie.getPassword())
              .soldeCompagnie(compagnie.getSoldeCompagnie())
              .relationPointventeCompagnieDto(compagnie.getRelationPointventeCompagnies() != null ?
                      compagnie.getRelationPointventeCompagnies().stream().map(RelationPointventeCompagnieDto::toDto).collect(Collectors.toList()):
                      Collections.emptyList())

              .abonnement(compagnie.getAbonnements() != null ?
                      compagnie.getAbonnements().stream().map(AbonnementDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .agenceDto(compagnie.getAgences() != null ?
                      compagnie.getAgences().stream().map(AgenceDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .attestationDto(compagnie.getAttestations() != null ?
                      compagnie.getAttestations().stream().map(AttestationDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .factureDto(compagnie.getFactures() != null ?
                      compagnie.getFactures().stream().map(FactureDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .contactDto(compagnie.getContacts() != null ?
                      compagnie.getContacts().stream().map(ContactDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .soldePrepayeDto(compagnie.getSoldePrepayes() != null ?
                      compagnie.getSoldePrepayes().stream().map(SoldePrepayeDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
              .attestationsAutoriseesDto(compagnie.getAttestationsAutorisees() !=null ?
                      compagnie.getAttestationsAutorisees().stream().map(AttestationsAutoriseesDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())
             /* .pointventeDto(compagnie.getPointventes()!= null ?
                      compagnie.getPointventes().stream().map(PointventeDto::toDto).collect(Collectors.toList()) :
                      Collections.emptyList())*/
              .build();
  }

    static public Compagnie convertCompagnieDtoToEntity(CompagnieDto compagnieDto) {
        Compagnie compagnie = new Compagnie();
        compagnie.setId(compagnieDto.getId());
        compagnie.setNom(compagnieDto.getNom());
        compagnie.setRaisonSocial(compagnieDto.getRaison_social());
        compagnie.setAdresse(compagnieDto.getAdresse());
        compagnie.setTelephone(compagnieDto.getTelephone());
        compagnie.setEmail(compagnieDto.getEmail());
        compagnie.setStatut(compagnieDto.getStatut());
        compagnie.setPassword(compagnieDto.getPassword());

        // Initialisez la liste d'abonnements
        if (compagnieDto.getAbonnement() != null) {
            List<Abonnement> abonnements = compagnieDto.getAbonnement().stream()
                    .map(AbonnementDto::convertAbonnementDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setAbonnements(abonnements);
        } else {
            compagnie.setAbonnements(Collections.emptyList());
        }

        // Initialisez la liste d'attestations
        if (compagnieDto.getAttestationDto() != null) {
            List<Attestation> attestations = compagnieDto.getAttestationDto().stream()
                    .map(AttestationDto::convertAttestationDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setAttestations(attestations);
        } else {
            compagnie.setAttestations(Collections.emptyList());
        }

        // Initialisez la liste de factures
        if (compagnieDto.getFactureDto() != null) {
            List<Facture> factures = compagnieDto.getFactureDto().stream()
                    .map(FactureDto::convertFactureDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setFactures(factures);
        } else {
            compagnie.setFactures(Collections.emptyList());
        }

        // Initialisez la liste de contacts
        if (compagnieDto.getContactDto() != null) {
            List<Contact> contacts = compagnieDto.getContactDto().stream()
                    .map(ContactDto::convertContactDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setContacts(contacts);
        } else {
            compagnie.setContacts(Collections.emptyList());
        }

        // Initialisez la liste de soldes prépayés
        if (compagnieDto.getSoldePrepayeDto() != null) {
            List<SoldePrepaye> soldesPrepayes = compagnieDto.getSoldePrepayeDto().stream()
                    .map(SoldePrepayeDto::convertSoldeprepayeDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setSoldePrepayes(soldesPrepayes);
        } else {
            compagnie.setSoldePrepayes(Collections.emptyList());
        }

        // Initialisez la liste d'agences
        if (compagnieDto.getAgenceDto() != null) {
            List<Agence> agences = compagnieDto.getAgenceDto().stream()
                    .map(AgenceDto::convertAgenceDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setAgences(agences);
        } else {
            compagnie.setAgences(Collections.emptyList());
        }

        // Initialisez la liste de points de vente
       /* if (compagnieDto.getPointventeDto() != null) {
            List<Pointvente> pointsventes = compagnieDto.getPointventeDto().stream()
                    .map(PointventeDto::convertPointventeDtoToEntity)
                    .collect(Collectors.toList());
            compagnie.setPointventes(pointsventes);
        } else {
            compagnie.setPointventes(Collections.emptyList());
        }*/

        return compagnie;
    }

}




