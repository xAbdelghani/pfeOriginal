package org.example.service;


import org.example.entity.Vehicule;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface VehiculeService {
    void saveorUpdate(Vehicule vehicule);
    List<Vehicule> listAll();
    void deleteVehicule(Long id);
    Vehicule getVehiculeByID(Long vehiculeid);
    List<Vehicule> getVehiculesByModeleVehiculeId(Long modeleVehiculeId); // nouvelle méthode

}
