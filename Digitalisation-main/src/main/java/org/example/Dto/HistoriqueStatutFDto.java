package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.HistoriqueStatutF;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoriqueStatutFDto {
    private Long id;

    private String statut;

    private String date_statut_facture;

    private String raison;

    public static HistoriqueStatutFDto toDto(HistoriqueStatutF historiqueStatutF){
        return HistoriqueStatutFDto.builder()
                .id(historiqueStatutF.getId())
                .statut(historiqueStatutF.getStatut())
                .date_statut_facture(historiqueStatutF.getDate_statut_facture())
                .raison(historiqueStatutF.getRaison())
                .build();
    }
}
