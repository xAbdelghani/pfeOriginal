package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.RelationPointventeCompagnie;
import org.example.entity.StatutHistoriqueC;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RelationPointventeCompagnieDto {
    private Long id;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    private String raison_social;
    private String nomp;
    private Long compagnieId;
    private Long pointventeId;
    private String suspensionReason;
private String status;
    private String latestLibellec;
private String raison;
    private boolean active;
    private List<StatutHistoriqueCDto> statutHistoriqueC;

    public static RelationPointventeCompagnieDto toDto(RelationPointventeCompagnie relationPointventeCompagnie){
        String latestLibellec = null;
        if (!relationPointventeCompagnie.getStatutHistoriquec().isEmpty()) {
            StatutHistoriqueC latestStatutHistorique = relationPointventeCompagnie.getStatutHistoriquec()
                    .stream()
                    .max(Comparator.comparing(StatutHistoriqueC::getDateChangement))
                    .orElse(null);
            if (latestStatutHistorique != null) {
                latestLibellec = latestStatutHistorique.getStatutC().getLibellec();
            }
        }
         RelationPointventeCompagnieDto.RelationPointventeCompagnieDtoBuilder builder=RelationPointventeCompagnieDto
                 .builder()
                .id(relationPointventeCompagnie.getId())
                .dateDebut(relationPointventeCompagnie.getDateDebut())
                .dateFin(relationPointventeCompagnie.getDateFin())
                .raison_social(relationPointventeCompagnie.getCompagnie() != null ? relationPointventeCompagnie.getCompagnie().getRaisonSocial() : null)
                .nomp(relationPointventeCompagnie.getPointvente() !=null ? relationPointventeCompagnie.getPointvente().getNomp() : null)
                 .active(relationPointventeCompagnie.isActive())
                 .latestLibellec(latestLibellec)
                 .suspensionReason(relationPointventeCompagnie.getSuspensionReason())
                 .statutHistoriqueC(relationPointventeCompagnie.getStatutHistoriquec().stream().map(StatutHistoriqueCDto::toDto).collect(Collectors.toList()));


        if (relationPointventeCompagnie.getCompagnie() != null) {
            builder.compagnieId(relationPointventeCompagnie.getCompagnie().getId()); // Only reference ID to avoid recursion
        }
        if (relationPointventeCompagnie.getPointvente() != null) {
            builder.pointventeId(relationPointventeCompagnie.getPointvente().getId()); // Only reference ID to avoid recursion
        }
        return  builder.build();
    }
}
