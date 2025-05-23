package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.HistoriqueStatutAtt;
import org.example.entity.StatutA;
import org.example.entity.Statut_Att;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Statut_AttDto {
    private Long id;

    private String libelles;

    private List<HistoriqueStatutAtt> historiqueStatutAtts;

    public static Statut_AttDto toDto(Statut_Att statutAtt){
        return Statut_AttDto.builder()
                .id(statutAtt.getId())
                .libelles(statutAtt.getLibelles())
                //.statutHistorique(statutA.getStatutHistoriques().stream().map(StatutHistoriqueDto::toDto).collect(Collectors.toList()))
                .build();
    }
}
