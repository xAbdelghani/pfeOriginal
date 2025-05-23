package org.example.service.impl;

import org.example.entity.Type_Abonnement;
import org.example.entity.Type_Facture;
import org.example.repository.Type_AbonnementRepository;
import org.example.repository.Type_FactureRepository;
import org.example.service.Type_AbonnementService;
import org.example.service.Type_FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Type_FactureServiceImpl implements Type_FactureService {
    @Autowired
    private Type_FactureRepository repo;


    @Override
    public void saveorUpdate(Type_Facture typeFactures) {
        repo.save(typeFactures);
    }

    @Override
    public List<Type_Facture> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteTypeFacture(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Type_Facture getTypeFactureByID(Long typeFactureid) {
        return repo.findById(typeFactureid).get();
    }
}
