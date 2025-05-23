package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Offre;
import org.example.entity.SoldePrepaye;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OffreDto {
    private Long id;

    private String libelle;

    private List<SoldePrepayeDto> soldePrepayeDto;

    public static OffreDto toDto(Offre offre){
        return OffreDto.builder()
                .id(offre.getId())
                .libelle(offre.getLibelle())
                //.soldePrepayeDto(offre.getSoldePrepayes().stream().map(SoldePrepayeDto::toDto).collect(Collectors.toList()))
                .build();
    }


}
