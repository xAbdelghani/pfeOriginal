package org.example.service.impl;

import org.example.entity.Type_Abonnement;
import org.example.repository.FactureRepository;
import org.example.repository.Type_AbonnementRepository;
import org.example.service.Type_AbonnementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Type_AbonnementServiceImpl implements Type_AbonnementService {

    @Autowired
    private Type_AbonnementRepository repo;
    @Override
    public void saveorUpdate(Type_Abonnement typeAbonnements) {
        repo.save(typeAbonnements);
    }

    @Override
    public List<Type_Abonnement> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteTypeAbonnement(String id) {
        repo.deleteById(id);
    }

    @Override
    public Type_Abonnement getTypeAbonnementByID(String typeAbonnementid) {
        return repo.findById(typeAbonnementid).get();
    }
}
