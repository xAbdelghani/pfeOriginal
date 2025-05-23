package org.example.service;


import org.example.entity.Modele_Vehicule;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface Modele_VehiculeService {
    void saveorUpdate(Modele_Vehicule modeleVehicule);
    List<Modele_Vehicule> listAll();
    void deleteModele_Vehicule(Long id);
    Modele_Vehicule getModele_VehiculeByID(Long modeleVehiculeid);
}
