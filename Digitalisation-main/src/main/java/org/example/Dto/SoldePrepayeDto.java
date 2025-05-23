package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Compagnie;
import org.example.entity.Offre;
import org.example.entity.SoldePrepaye;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SoldePrepayeDto {
    private Long id;

    private BigDecimal solde;

    private LocalDate date_Abonnement;

    private String type;

    private String devise;

    private String statut;

    private String raison_social;

    private CompagnieDto compagnieDto;

    private OffreDto offreDto;

    //private String libelle;

    private String raison;
    private Long compagnieId;
    private int solde_attestation;
    private List<StatutHistoriqueDto> statutHistorique;
    private BigDecimal soldeCompagnie = BigDecimal.ZERO;




    public static SoldePrepayeDto toDto(SoldePrepaye soldePrepaye){
         SoldePrepayeDto.SoldePrepayeDtoBuilder builder = SoldePrepayeDto
                 .builder()
                .id(soldePrepaye.getId())
                .solde(soldePrepaye.getSolde())
                .date_Abonnement(soldePrepaye.getDate_Abonnement())
                .devise(soldePrepaye.getDevise())
                .type(soldePrepaye.getType())
                .statut(soldePrepaye.getStatut())
                 .raison_social(soldePrepaye.getOwnerso() != null ? soldePrepaye.getOwnerso().getRaisonSocial() : null)
                // .libelle(soldePrepaye.getOwnerpr() != null ? soldePrepaye.getOwnerpr().getLibelle() :null)
                .solde_attestation(soldePrepaye.getSolde_attestation() )
                 .soldeCompagnie(soldePrepaye.getOwnerso()!= null ? soldePrepaye.getOwnerso().getSoldeCompagnie() : null)
                .statutHistorique(soldePrepaye.getStatutHistorique().stream().map(StatutHistoriqueDto::toDto).collect(Collectors.toList()));
        if (soldePrepaye.getOwnerso() != null) {
            builder.compagnieId(soldePrepaye.getOwnerso().getId());
        }

        /* if(soldePrepaye.getOwnerso() != null){;
             builder.compagnieDto(CompagnieDto.toDto(soldePrepaye.getOwnerso()));
         }*/
        return  builder.build();
    }

   static  public SoldePrepaye convertSoldeprepayeDtoToEntity(SoldePrepayeDto soldePrepayeDto) {
        SoldePrepaye soldePrepaye = new SoldePrepaye();
        soldePrepaye.setId(soldePrepayeDto.getId());
        soldePrepaye.setSolde(soldePrepayeDto.getSolde());
        soldePrepaye.setDate_Abonnement(soldePrepayeDto.getDate_Abonnement());
        soldePrepaye.setType(soldePrepayeDto.getType());
        soldePrepaye.setDevise(soldePrepayeDto.getDevise());
        soldePrepaye.setStatut(soldePrepayeDto.getStatut());


        // Assurez-vous que les relations ManyToOne avec Compagnie et Offre sont correctement définies dans votre entité SoldePrepaye
        // Définissez les instances de Compagnie et Offre en fonction des DTO ou des identifiants, selon la logique de votre application

        // Si les DTO sont complets (avec les objets CompagnieDto et OffreDto), utilisez-les pour initialiser les relations
        if (soldePrepayeDto.getCompagnieDto() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(soldePrepayeDto.getCompagnieDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Compagnie si nécessaire
            soldePrepaye.setOwnerso(compagnie);
        } else if (soldePrepayeDto.getCompagnieId() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(soldePrepayeDto.getCompagnieId());
            // Assurez-vous que l'objet Compagnie contient uniquement l'ID pour éviter la récursivité
            soldePrepaye.setOwnerso(compagnie);
        }

        if (soldePrepayeDto.getOffreDto() != null) {
            // Initialisez l'offre en fonction du DTO
            Offre offre = new Offre();
            offre.setId(soldePrepayeDto.getOffreDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Offre si nécessaire
            soldePrepaye.setOwnerpr(offre);
        }

        return soldePrepaye;
    }

}
