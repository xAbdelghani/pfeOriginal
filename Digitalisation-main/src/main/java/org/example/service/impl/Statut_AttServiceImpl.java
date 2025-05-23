package org.example.service.impl;


import org.example.entity.Statut_Att;

import org.example.repository.Statut_AttRepository;
import org.example.service.Statut_AttService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Statut_AttServiceImpl implements Statut_AttService {
    @Autowired
    private Statut_AttRepository repo;
    @Override
    public void saveorUpdate(Statut_Att statutAtt) {
        repo.save(statutAtt);
    }

    @Override
    public List<Statut_Att> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteStatut_Att(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Statut_Att getStatut_AttByID(Long statutAttid) {
        return repo.findById(statutAttid).get();
    }
}
