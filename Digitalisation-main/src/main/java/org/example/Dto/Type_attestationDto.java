package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Type_attestation;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Type_attestationDto {
    private Long id;

    private String libelle;

    private BigDecimal prix_unitaire;

    private String devise;

    private List<AttestationDto> attestationDto;

    public static Type_attestationDto toDto (Type_attestation type_attestation){
        return Type_attestationDto.builder()
                .id(type_attestation.getId())
                .libelle(type_attestation.getLibelle())
                .prix_unitaire(type_attestation.getPrix_unitaire())
                .devise(type_attestation.getDevise())
                //.attestationDto(type_attestation.getAttestations().stream().map(AttestationDto::toDto).collect(Collectors.toList()))
                .build();
    }
}
