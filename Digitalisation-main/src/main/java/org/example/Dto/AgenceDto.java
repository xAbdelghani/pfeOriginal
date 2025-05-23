package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Agence;
import org.example.entity.Compagnie;
import org.example.entity.Contact;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgenceDto {
    private Long id;

    private String noma;

    private String adressea;

    private String telephonea;

    private LocalDate date_Debuta;

    private LocalDate date_fina;

    private String raison_social;

    private Long compagnieId;

    private CompagnieDto compagnieDto;

    private String status;

    public static AgenceDto toDto(Agence agence) {
        AgenceDto.AgenceDtoBuilder builder = AgenceDto
                .builder()
                .id(agence.getId())
                .noma(agence.getNoma())
                .adressea(agence.getAdressea())
                .telephonea(agence.getTelephonea())
                .date_Debuta(agence.getDate_Debuta())
                .date_fina(agence.getDate_fina())
                .status(agence.getStatus())
                .raison_social(agence.getOwnerag() != null ? agence.getOwnerag().getRaisonSocial() : null);
        if (agence.getOwnerag() != null) {
            builder.compagnieId(agence.getOwnerag().getId()); // Only reference ID to avoid recursion
        }
        return builder.build();

    }

    public static Agence convertAgenceDtoToEntity(AgenceDto agenceDto) {
        Agence agence = new Agence();
        agence.setId(agenceDto.getId());
        agence.setNoma(agenceDto.getNoma());
        agence.setDate_Debuta(agenceDto.getDate_Debuta());
        agence.setStatus(agenceDto.getStatus());
        agence.setAdressea(agenceDto.getAdressea());
        agence.setTelephonea(agenceDto.getTelephonea());
        if (agenceDto.getCompagnieDto() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(agenceDto.getCompagnieDto().getId());
            // Vous pouvez initialiser d'autres propriétés de Compagnie si nécessaire
            agence.setOwnerag(compagnie);
        } else if (agenceDto.getCompagnieId() != null) {
            Compagnie compagnie = new Compagnie();
            compagnie.setId(agenceDto.getCompagnieId());
            // Assurez-vous que l'objet Compagnie contient uniquement l'ID pour éviter la récursivité
            agence.setOwnerag(compagnie);
        }

        return agence;
    }

}

