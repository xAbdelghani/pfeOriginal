package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.AttestationsAutorisees;
import org.example.entity.AttestationsAutoriseesKey;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttestationsAutoriseesDto {

    private AttestationsAutoriseesKey id;
    private boolean flag;
    private Long compagnieId;
    private Long typeattestationId;
    private String raison_social;
    private String libelle;

    public static AttestationsAutoriseesDto toDto(AttestationsAutorisees attestationsAutorisees) {
        AttestationsAutoriseesDto.AttestationsAutoriseesDtoBuilder builder = AttestationsAutoriseesDto.builder()
                .id(attestationsAutorisees.getId())
                .flag(attestationsAutorisees.isFlag())
                .raison_social(attestationsAutorisees.getOwneratau() != null ? attestationsAutorisees.getOwneratau().getRaisonSocial() : null)
                .libelle(attestationsAutorisees.getOwnertatau() != null ? attestationsAutorisees.getOwnertatau().getLibelle() : null);
        if (attestationsAutorisees.getOwnertatau() != null) {
            builder.compagnieId(attestationsAutorisees.getOwnertatau().getId()); // Only reference ID to avoid recursion
        }
        if (attestationsAutorisees.getOwnertatau() != null) {
            builder.typeattestationId(attestationsAutorisees.getOwnertatau().getId());
        }

        return builder.build();
    }
}
