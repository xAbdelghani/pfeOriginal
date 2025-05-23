package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.StatutC;
import org.example.entity.StatutHistoriqueC;


import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatutCDto {

    private Long id;

    private String libellec;
    private List<StatutHistoriqueCDto> statutHistoriqueC;
    public static StatutCDto toDto(StatutC statutC){
        return StatutCDto.builder()
                .id(statutC.getId())
                .libellec(statutC.getLibellec())
                //.statutHistoriqueC(statutC.getStatutHistoriquecs().stream().map(StatutHistoriqueCDto::toDto).collect(Collectors.toList()))
                .build();
    }
}
