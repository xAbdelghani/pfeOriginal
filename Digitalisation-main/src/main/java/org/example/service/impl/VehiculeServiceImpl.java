package org.example.service.impl;


import org.example.entity.Vehicule;
import org.example.repository.VehiculeRepository;
import org.example.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculeServiceImpl implements VehiculeService {
    @Autowired
    private VehiculeRepository repo;
    @Override
    public void saveorUpdate(Vehicule vehicule) {
        repo.save(vehicule);
    }

    @Override
    public List<Vehicule> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteVehicule(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Vehicule getVehiculeByID(Long vehiculeid) {
        return repo.findById(vehiculeid).get();
    }

    @Override
    public List<Vehicule> getVehiculesByModeleVehiculeId(Long modeleVehiculeId) {
        return repo.findByModeleVehicule_Id(modeleVehiculeId);
    }
}
