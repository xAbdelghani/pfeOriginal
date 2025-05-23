package org.example.Dto;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Compagnie;
import org.example.entity.Pointvente;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PointventeDto {
    private Long id;

    private LocalDate date_Debutp;



    private LocalDate date_finp;

    private String nomp;
    private String telephonep;


    private String emailp;

    private List<CompagnieDto>  compagnieDto;

    List<RelationPointventeCompagnieDto> relationPointventeCompagnieDto;

    public  static  PointventeDto toDto(Pointvente pointvente){
        return PointventeDto.builder()
                .id(pointvente.getId())
                .date_Debutp(pointvente.getDate_Debutp())
                .date_finp(pointvente.getDate_finp())
                .nomp(pointvente.getNomp())
                .telephonep(pointvente.getTelephonep())
                .emailp(pointvente.getEmailp())
                .relationPointventeCompagnieDto(pointvente.getRelationPointventeCompagnies().stream().map(RelationPointventeCompagnieDto::toDto).collect(Collectors.toList()))
                //.compagnieDto(pointvente.getCompagnies().stream().map(CompagnieDto::toDto).collect(Collectors.toList()))
                .build();
    }

    static public Pointvente convertPointventeDtoToEntity(PointventeDto pointventeDto) {
        Pointvente pointvente = new Pointvente();
        pointvente.setId(pointventeDto.getId());
        pointvente.setDate_Debutp(pointventeDto.getDate_Debutp());
        pointvente.setDate_finp(pointventeDto.getDate_finp());
        pointvente.setNomp(pointventeDto.getNomp());
        pointvente.setTelephonep(pointventeDto.getTelephonep());
        pointvente.setEmailp(pointventeDto.getEmailp());

        // Assurez-vous que les relations ManyToMany avec Compagnie sont correctement définies dans votre entité Pointvente
        // Définissez les instances de Compagnie en fonction des DTO ou des identifiants, selon la logique de votre application
        // Assurez-vous que vous utilisez une collection de Compagnie dans votre entité Pointvente

        // Si les DTO sont complets (avec les objets CompagnieDto), utilisez-les pour initialiser les relations


        return pointvente;
    }

}
