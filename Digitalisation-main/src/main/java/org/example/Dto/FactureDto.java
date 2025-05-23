package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Facture;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FactureDto {
    private Long id;

    private LocalDate date_Debutt;

    private String typeF;

    private LocalDate date_Echeance;

    private LocalDate date_Reglement;

    private String statut;

    private Double taxe;

    private Double prime;

    private Type_FactureDto typeFactureDto;

    private CompagnieDto compagnieDto;

    private String raison_social;

    private String nom;

    private String adresse;

    private String telephone;

    private String email;


    /* public static FactureDto toDto(Facture facture){
        FactureDto.FactureDtoBuilder builder =FactureDto
                .builder()
                .id(facture.getId())
                .date_Debutt(facture.getDate_Debutt())
                .typeF(facture.getTypeF())
                .date_Echeance(facture.getDate_Echeance())
                .date_Reglement(facture.getDate_Reglement())
                .statut(facture.getStatut())
                .taxe(facture.getTaxe())
                .prime(facture.getPrime());
                if(facture.getOwnertfa() != null){
                    builder.typeFactureDto(Type_FactureDto.toDto(facture.getOwnertfa()));
                }

                if(facture.getOwnerfa() != null){
                    builder.compagnieDto(CompagnieDto.toDto(facture.getOwnerfa()));
                }

        return builder().build();
    }*/

    public static FactureDto toDto(Facture facture) {
        if (facture == null) {
            return null;
        }

        return FactureDto.builder()
                .id(facture.getId())
                .date_Debutt(facture.getDate_Debutt())
                .typeF(facture.getTypeF())
                .date_Echeance(facture.getDate_Echeance())
                .date_Reglement(facture.getDate_Reglement())
                .statut(facture.getStatut())
                .taxe(facture.getTaxe())
                .prime(facture.getPrime())
                .raison_social(facture.getOwnerfa().getRaisonSocial())
                .nom(facture.getOwnerfa().getNom())
                .adresse(facture.getOwnerfa().getAdresse())
                .telephone(facture.getOwnerfa().getTelephone())
                .email(facture.getOwnerfa().getEmail())
                .build();
    }

    static public Facture convertFactureDtoToEntity(FactureDto factureDto) {
        Facture facture = new Facture();
        facture.setId(factureDto.getId());
        facture.setDate_Debutt(factureDto.getDate_Debutt());
        facture.setTypeF(factureDto.getTypeF());
        facture.setDate_Echeance(factureDto.getDate_Echeance());
        facture.setDate_Reglement(factureDto.getDate_Reglement());
        facture.setStatut(factureDto.getStatut());
        facture.setTaxe(factureDto.getTaxe());
        facture.setPrime(factureDto.getPrime());

        // Assurez-vous que les relations avec les autres entités sont correctement définies dans votre entité Facture
        // Définissez les instances de Type_Facture et Compagnie en fonction des DTO ou des identifiants, selon la logique de votre application
        // Assurez-vous que vous utilisez des instances de Type_Facture et Compagnie dans votre entité Facture

        // Si les DTO sont complets (avec les objets Type_FactureDto et CompagnieDto), utilisez-les pour initialiser les relations


        return facture;
    }

}
