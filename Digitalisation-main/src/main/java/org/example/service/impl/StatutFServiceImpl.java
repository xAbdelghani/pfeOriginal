package org.example.service.impl;


import org.example.entity.StatutF;
import org.example.repository.StatutFRepository;
import org.example.service.StatutFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatutFServiceImpl implements StatutFService {
    @Autowired
    private StatutFRepository repo;
    @Override
    public void saveorUpdate(StatutF statutF) {
        repo.save(statutF);
    }

    @Override
    public List<StatutF> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteStatutF(Long id) {
        repo.deleteById(id);
    }

    @Override
    public StatutF getStatutFByID(Long statutFid) {
        return repo.findById(statutFid).get();
    }
}
