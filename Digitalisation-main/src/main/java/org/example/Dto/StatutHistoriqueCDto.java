package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.StatutHistorique;
import org.example.entity.StatutHistoriqueC;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatutHistoriqueCDto {
    private Long id;

    private String statut;

    private String dateChangement;

    private LocalDate dateDebutc;

    private LocalDate dateFinc;

    private String raison;
    private String libellec;

    public static StatutHistoriqueCDto toDto(StatutHistoriqueC statutHistoriqueC) {

        return StatutHistoriqueCDto.builder()
                .id(statutHistoriqueC.getId())
                .statut(statutHistoriqueC.getStatut())
                .dateChangement(statutHistoriqueC.getDateChangement())
                .dateDebutc(statutHistoriqueC.getDateDebutc())
                .dateFinc(statutHistoriqueC.getDateFinc())
                .raison(statutHistoriqueC.getRaison())
                .libellec(statutHistoriqueC.getStatutC() != null ? statutHistoriqueC.getStatutC().getLibellec() :null)
                .build();
    }

}
