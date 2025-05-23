package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.StatutA;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatutADto {
    private Long id;

    private String libellep;

    private List<StatutHistoriqueDto> statutHistorique;

public static StatutADto toDto(StatutA statutA){
    return StatutADto.builder()
            .id(statutA.getId())
            .libellep(statutA.getLibellep())
            //.statutHistorique(statutA.getStatutHistoriques().stream().map(StatutHistoriqueDto::toDto).collect(Collectors.toList()))
            .build();
}

}
