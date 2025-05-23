package org.example.service.impl;

import org.example.entity.Facture;
import org.example.repository.CompagnieRepository;
import org.example.repository.FactureRepository;
import org.example.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactureServiceImpl implements FactureService {

    @Autowired
    private FactureRepository repo;
    @Override
    public void saveorUpdate(Facture factures) {
        repo.save(factures);
    }

    @Override
    public List<Facture> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteFacture(Long id) {
        repo.deleteById(id);

    }

    @Override
    public Facture getFactureByID(Long factureid) {
        return repo.findById(factureid).get();
    }

    @Override
    public List<Facture> getFacturesByCompagnie(Long compagnieId) {
        return repo.findByOwnerfaId(compagnieId);
    }
}
