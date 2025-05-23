package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.HistoriqueStatutAtt;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoriqueStatutAttDto {
    private Long id;
    private String statut;
    private String date_Statut;
    private String raison;

    public static HistoriqueStatutAttDto toDto(HistoriqueStatutAtt historiqueStatutAtt){
        return HistoriqueStatutAttDto.builder()
                .id(historiqueStatutAtt.getId())
                .statut(historiqueStatutAtt.getStatut())
                .date_Statut(historiqueStatutAtt.getDateStatut())
                .raison(historiqueStatutAtt.getRaison())
                .build();
    }
}
