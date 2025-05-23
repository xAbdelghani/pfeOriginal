package org.example.service.impl;


import org.example.entity.Offre;
import org.example.repository.OffreRepository;
import org.example.service.OffreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OffreServiceImpl implements OffreService {
    @Autowired
    private OffreRepository repo;
    @Override
    public void saveorUpdate(Offre offre) {
        repo.save(offre);
    }

    @Override
    public List<Offre> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteOffre(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Offre getOffreByID(Long offreid) {
        return repo.findById(offreid).get();
    }
}
