package org.example.service.impl;


import org.example.entity.Modele_Vehicule;
import org.example.repository.Modele_VehiculeRepository;
import org.example.service.Modele_VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class Modele_VehiculeServiceImpl implements Modele_VehiculeService {
    @Autowired
    private Modele_VehiculeRepository repo;
    @Override
    public void saveorUpdate(Modele_Vehicule modeleVehicule) {
        repo.save(modeleVehicule);
    }

    @Override
    public List<Modele_Vehicule> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteModele_Vehicule(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Modele_Vehicule getModele_VehiculeByID(Long modeleVehiculeid) {
        return repo.findById(modeleVehiculeid).get();
    }
}
