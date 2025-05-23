package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.StatutHistorique;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatutHistoriqueDto {
    private Long id;
    private String statut;
    private String date;
    private String raison;
   private String libellep;

    public static StatutHistoriqueDto toDto(StatutHistorique statutHistorique) {

        return StatutHistoriqueDto.builder()
                .id(statutHistorique.getId())
                .statut(statutHistorique.getStatut())
                .date(statutHistorique.getDate())
                .raison(statutHistorique.getRaison())
                .libellep(statutHistorique.getStatutA() != null ? statutHistorique.getStatutA().getLibellep() :null)
                .build();
    }
}
