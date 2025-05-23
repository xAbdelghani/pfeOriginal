package org.example.service.impl;


import org.example.entity.Fonction;
import org.example.repository.FonctionRepository;
import org.example.service.FactureService;
import org.example.service.FonctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FonctionServiceImpl implements FonctionService {
    @Autowired
    private FonctionRepository repo;
    @Override
    public void saveorUpdate(Fonction fonctions) {
        repo.save(fonctions);
    }

    @Override
    public List<Fonction> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteFonction(Long id) {
        repo.deleteById(id);

    }

    @Override
    public Fonction getFonctionByID(Long fonctionid) {
        return repo.findById(fonctionid).get();
    }
}
