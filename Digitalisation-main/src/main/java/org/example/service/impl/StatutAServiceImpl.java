package org.example.service.impl;

import org.example.entity.StatutA;
import org.example.entity.Type_Abonnement;
import org.example.repository.StatutAReposirory;
import org.example.repository.Type_AbonnementRepository;
import org.example.service.StatutAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatutAServiceImpl implements StatutAService {
    @Autowired
    private StatutAReposirory repo;
    @Override
    public void saveorUpdate(StatutA statutAs) {
        repo.save(statutAs);
    }

    @Override
    public List<StatutA> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteStatusA(Long id) {
        repo.deleteById(id);
    }

    @Override
    public StatutA getStatusAByID(Long statutAid) {
        return repo.findById(statutAid).get();
    }
}
