package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Type_Facture;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Type_FactureDto {
    private Long id;

    private String libelle;

    public static Type_FactureDto toDto(Type_Facture typeFacture){
        return  Type_FactureDto.builder()
                .id(typeFacture.getId())
                .libelle(typeFacture.getLibelle())
                .build();

    }
}
