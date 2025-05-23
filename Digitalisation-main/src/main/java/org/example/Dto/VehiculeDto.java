package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Modele_Vehicule;
import org.example.entity.Vehicule;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehiculeDto {
    private Long id;

    private LocalDate date_Immatriculation;

    private String immatriculation;

    private Modele_VehiculeDto modeleVehiculeDto;
    private String designation;

    private String type;

    private String marque;

    private int annee;

    private Double puissanceFiscale;

    private String carburant;
    public static VehiculeDto toDto(Vehicule vehicule) {
        Modele_Vehicule modeleVehicule = vehicule.getModeleVehicule();

        return VehiculeDto.builder()
                .id(vehicule.getId())
                .immatriculation(vehicule.getImmatriculation())
                .date_Immatriculation(vehicule.getDate_Immatriculation())
                .designation(modeleVehicule != null ? modeleVehicule.getDesignation() : null)
                .type(modeleVehicule != null ? modeleVehicule.getType() : null)
                .marque(modeleVehicule != null ? modeleVehicule.getMarque() : null)
                .annee(modeleVehicule != null ? modeleVehicule.getAnnee() : 0)
                .puissanceFiscale(modeleVehicule != null ? modeleVehicule.getPuissanceFiscale() : null)
                .carburant(modeleVehicule != null ? modeleVehicule.getCarburant() : null)
                .build();
    }
}
