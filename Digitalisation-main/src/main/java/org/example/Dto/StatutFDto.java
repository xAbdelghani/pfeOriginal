package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.StatutA;
import org.example.entity.StatutF;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatutFDto {
    private Long id;

    private String libellef;

    public static StatutFDto toDto(StatutF statutF){
        return StatutFDto.builder()
                .id(statutF.getId())
                .libellef(statutF.getLibellef())
                //.statutHistorique(statutA.getStatutHistoriques().stream().map(StatutHistoriqueDto::toDto).collect(Collectors.toList()))
                .build();
    }
}
