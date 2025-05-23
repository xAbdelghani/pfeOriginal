package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Abonnement;
import org.example.entity.Compagnie;
import org.example.entity.Type_Abonnement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AbonnementDto {

    private Long id;

    private BigDecimal montant;

    private LocalDate date_Abonnement;

    private String devise;

    private LocalDate date_Fin;

    private String type;

    private String statut;

    private Type_AbonnementDto typeabonnement;

    private CompagnieDto compagnieDto;

    private Long compagnieId;

    private String raison_social;

    private String libelle;
    private String raison;

    private List<StatutHistoriqueDto> statutHistorique;

    public static AbonnementDto toDto(Abonnement abonnement){
        AbonnementDto.AbonnementDtoBuilder builder=AbonnementDto
                .builder()
                .id(abonnement.getId())
                .montant(abonnement.getMontant())
                .devise(abonnement.getDevise())

                .type(abonnement.getType())
                .statut(abonnement.getStatut())
                .date_Abonnement(abonnement.getDate_Abonnement())
                .date_Fin(abonnement.getDate_Fin())
                .raison_social(abonnement.getOwnerab() != null ? abonnement.getOwnerab().getRaisonSocial() : null)

                .libelle(abonnement.getOwnertab() != null ? abonnement.getOwnertab().getLibelle() :null)
                .statutHistorique(abonnement.getStatutHistorique().stream().map(StatutHistoriqueDto::toDto).collect(Collectors.toList()));




       /* if(abonnement.getOwnertab() != null){
            builder.typeabonnement(Type_AbonnementDto.toDto(abonnement.getOwnertab()));
        }*/
       /*if(abonnement.getOwnerab() != null){
            builder.compagnieDto(CompagnieDto.toDto(abonnement.getOwnerab()));
        }*/
        if (abonnement.getOwnerab() != null) {
            builder.compagnieId(abonnement.getOwnerab().getId()); // Only reference ID to avoid recursion
        }
        return  builder.build();
    }

    static public Abonnement convertAbonnementDtoToEntity(AbonnementDto abonnementDto) {
        Abonnement abonnement = new Abonnement();
        abonnement.setId(abonnementDto.getId());
        abonnement.setMontant(abonnementDto.getMontant());
        abonnement.setDate_Abonnement(abonnementDto.getDate_Abonnement());
        abonnement.setDevise(abonnementDto.getDevise());
        abonnement.setDate_Fin(abonnementDto.getDate_Fin());
        abonnement.setType(abonnementDto.getType());
        abonnement.setStatut(abonnementDto.getStatut());

        // Assurez-vous que les relations ManyToOne avec Compagnie et Type_Abonnement sont correctement définies dans votre entité Abonnement
        // Définissez les instances de Compagnie et Type_Abonnement en fonction des DTO ou des identifiants, selon la logique de votre application

        // Si les DTO sont complets (avec les objets CompagnieDto et Type_AbonnementDto), utilisez-les pour initialiser les relations
        if (abonnementDto.getCompagnieDto() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(abonnementDto.getCompagnieDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Compagnie si nécessaire
            abonnement.setOwnerab(compagnie);
        } else if (abonnementDto.getCompagnieId() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(abonnementDto.getCompagnieId());
            // Assurez-vous que l'objet Compagnie contient uniquement l'ID pour éviter la récursivité
            abonnement.setOwnerab(compagnie);
        }

        if (abonnementDto.getTypeabonnement() != null) {
            // Initialisez le type d'abonnement en fonction du DTO
            Type_Abonnement typeAbonnement = new Type_Abonnement();
            typeAbonnement.setId(abonnementDto.getTypeabonnement().getId());
            // Vous pouvez initialiser d'autres propriétés de Type_Abonnement si nécessaire
            abonnement.setOwnertab(typeAbonnement);
        }

        return abonnement;
    }

}
