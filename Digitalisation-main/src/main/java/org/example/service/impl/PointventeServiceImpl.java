package org.example.service.impl;

import jakarta.persistence.EntityNotFoundException;
import org.example.Dto.*;
import org.example.entity.*;
import org.example.repository.CompagniePointVenteRepository;
import org.example.repository.CompagnieRepository;
import org.example.repository.FactureRepository;
import org.example.repository.PointventeRepository;
import org.example.service.PointventeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PointventeServiceImpl implements PointventeService {
    @Autowired
    private PointventeRepository repo;

    @Autowired
    private CompagnieRepository compagnieRepository;

    @Autowired
    private CompagniePointVenteRepository compagniePointVenteRepository;
    @Override
    public void saveorUpdate(Pointvente pointventes) {
        repo.save(pointventes);
    }

    @Override
    public List<Pointvente> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deletePointvente(Long id) {
        repo.deleteById(id);

    }

    @Override
    public Pointvente getPointventeByID(Long pointventeid) {
        return repo.findById(pointventeid).get();
    }

    /*@Override
    public List<Pointvente> findUnrelatedPointventes(Long compagnieId) {
        return repo.findUnrelatedPointventes(compagnieId);
    }*/




     /*@Override
     public void updatePointvente(Long id, Long compagnieId) {
         Pointvente existingCompagnie = repo.findById(id)
                 .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + id));

                 Compagnie compagnie= compagnieRepository.findById(compagnieId)
                 .orElseThrow(() -> new IllegalArgumentException("Invalid pointvente Id: " + compagnieId));

         // Assurez-vous que la liste de pointventes n'est pas null
         if (existingCompagnie.getCompagnies() == null) {
             existingCompagnie.setCompagnies(new ArrayList<>());
         }

         // Ajouter le pointvente à la liste de pointventes
         existingCompagnie.getCompagnies().add(compagnie);

         repo.save(existingCompagnie);
     }*/
   /*@Override
   public void updatePointvente(Long pointventeId, Long compagnieId, LocalDate dateDebut, LocalDate dateFin) {
       Pointvente pointvente = repo.findById(pointventeId)
               .orElseThrow(() -> new IllegalArgumentException("Invalid pointvente Id: " + pointventeId));
       Compagnie compagnie = compagnieRepository.findById(compagnieId)
               .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + compagnieId));

       // Créez ou mettez à jour la relation entre la compagnie et le point de vente avec les dates spécifiées
       RelationPointventeCompagnie compagniePointVente = compagniePointVenteRepository.findByCompagnieAndPointvente(compagnie, pointvente);
       if (compagniePointVente == null) {
           compagniePointVente = new RelationPointventeCompagnie();
           compagniePointVente.setCompagnie(compagnie);
           compagniePointVente.setPointvente(pointvente);
       }
       compagniePointVente.setDateDebut(dateDebut);
       compagniePointVente.setDateFin(dateFin);

       compagniePointVenteRepository.save(compagniePointVente);
   }*/

    @Override
    public void updatePointvente(Long pointventeId, Long compagnieId, LocalDate dateDebut, LocalDate dateFin) {
        Pointvente pointvente = repo.findById(pointventeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid pointvente Id: " + pointventeId));
        Compagnie compagnie = compagnieRepository.findById(compagnieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + compagnieId));

        List<RelationPointventeCompagnie> existingRelations = compagniePointVenteRepository.findByCompagnieAndPointventeAndActiveTrue(compagnie, pointvente);
        for (RelationPointventeCompagnie relation : existingRelations) {
            relation.setActive(false);
            compagniePointVenteRepository.save(relation);
        }

        RelationPointventeCompagnie newRelation = new RelationPointventeCompagnie();
        newRelation.setCompagnie(compagnie);
        newRelation.setPointvente(pointvente);
        newRelation.setDateDebut(dateDebut);
        newRelation.setDateFin(dateFin);
        newRelation.setActive(true);
        compagniePointVenteRepository.save(newRelation);
    }



}


