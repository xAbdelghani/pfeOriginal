package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Modele_Vehicule;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Modele_VehiculeDto {
    private Long id;

    private String designation;

    private String type;

    private String marque;

    private int annee;

    private Double puissanceFiscale;

    private String carburant;

    private List<VehiculeDto> vehiculeDto;
    public static Modele_VehiculeDto toDto(Modele_Vehicule modeleVehicule){
        return Modele_VehiculeDto.builder()
                .id(modeleVehicule.getId())
                .designation(modeleVehicule.getDesignation())
                .type(modeleVehicule.getType())
                .marque(modeleVehicule.getMarque())
                .annee(modeleVehicule.getAnnee())
                .puissanceFiscale(modeleVehicule.getPuissanceFiscale())
                .carburant(modeleVehicule.getCarburant())
                .vehiculeDto(modeleVehicule.getVehicules() != null ?
                        modeleVehicule.getVehicules().stream().map(VehiculeDto::toDto).collect(Collectors.toList()) :
                        Collections.emptyList())
                .build();
    }
}
