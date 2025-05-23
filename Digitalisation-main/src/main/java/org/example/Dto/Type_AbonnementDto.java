package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Type_Abonnement;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Type_AbonnementDto {
    private Long id;

    private String libelle;

    private Double duree;

    private String unite;



    public static Type_AbonnementDto toDto (Type_Abonnement typeAbonnement){
        return Type_AbonnementDto.builder()
                .id(typeAbonnement.getId())
                .libelle(typeAbonnement.getLibelle())
                .duree(typeAbonnement.getDuree())
                .unite(typeAbonnement.getUnite())
                .build();
    }
}
