package org.example.service.impl;


import org.example.entity.StatutC;

import org.example.repository.StatutCRepository;

import org.example.service.StatutCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatutCServiceImpl implements StatutCService {
    @Autowired
    private StatutCRepository repo;
    @Override
    public void saveorUpdate(StatutC statutCs) {
        repo.save(statutCs);
    }

    @Override
    public List<StatutC> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteStatusC(Long id) {
        repo.deleteById(id);
    }

    @Override
    public StatutC getStatusCByID(Long statutCid) {
        return repo.findById(statutCid).get();
    }
}
