package org.example.service.impl;


import org.example.Dto.CompagnieDto;
import org.example.Dto.RelationPointventeCompagnieDto;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.CompagniePointVenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompagniePointVenteServiceImpl implements CompagniePointVenteService {
    @Autowired
    private CompagniePointVenteRepository repo;

    @Autowired
    private PointventeRepository pointventeRepository;

    @Autowired
    private CompagnieRepository compagnieRepository;
    @Autowired
    private StatutHistoriqueCRepository statutHistoriqueRepository;
    @Autowired
    private StatutCRepository statutCReposirory;
    @Override
    public void saveorUpdate(RelationPointventeCompagnie relationPointventeCompagnies, Long Id) {
        StatutC statutC = statutCReposirory.findById(Id).orElse(null);
        Pointvente pointvente = relationPointventeCompagnies.getPointvente();
        if (pointvente != null && pointvente.getId() == null) {
            pointventeRepository.save(pointvente);
        }
        RelationPointventeCompagnie relationPointventeCompagnie = repo.save(relationPointventeCompagnies);
        if (statutC != null) {
            StatutHistoriqueC statutHistorique = new StatutHistoriqueC();
            statutHistorique.setRelationPointventeCompagnie(relationPointventeCompagnie);
            statutHistorique.setStatutC(statutC);
            statutHistorique.setDateChangement(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            statutHistorique.setDateDebutc(relationPointventeCompagnie.getDateDebut());
            statutHistorique.setDateFinc(relationPointventeCompagnie.getDateFin());
            statutHistoriqueRepository.save(statutHistorique);
        }
    }

   @Override
   public RelationPointventeCompagnie updateRelation(Long id, Map<String, Object> payload) {
       RelationPointventeCompagnie existingRelation = repo.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("RelationPointventeCompagnie not found with id " + id));

       // Update only the provided fields
       if (payload.containsKey("dateDebut")) {
           existingRelation.setDateDebut(LocalDate.parse((String) payload.get("dateDebut")));
       }
       if (payload.containsKey("dateFin")) {
           existingRelation.setDateFin(LocalDate.parse((String) payload.get("dateFin")));
       }
       if (payload.containsKey("statutCId")) {
           Long statutCId = Long.valueOf((Integer) payload.get("statutCId"));
           if (!existingRelation.getStatus().equals(statutCId.toString())) {
               StatutC statutC = statutCReposirory.findById(statutCId)
                       .orElseThrow(() -> new RuntimeException("StatutC not found with id " + statutCId));
               StatutHistoriqueC historique = new StatutHistoriqueC();
               historique.setRelationPointventeCompagnie(existingRelation);
               historique.setStatut(existingRelation.getStatus());
               historique.setDateChangement(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
               historique.setDateDebutc(existingRelation.getDateDebut());
               historique.setDateFinc(existingRelation.getDateFin());
               historique.setStatutC(statutC);
               statutHistoriqueRepository.save(historique);
               existingRelation.setStatus(statutC.getId().toString());
           }
       }
       if (payload.containsKey("active")) {
           existingRelation.setActive((Boolean) payload.get("active"));
       }
       if (payload.containsKey("suspensionReason")) {
           existingRelation.setSuspensionReason((String) payload.get("suspensionReason"));
       }

       // Save updated relation
       return repo.save(existingRelation);
   }

    @Override
    public List<RelationPointventeCompagnie> listAll() {

        //return this.repo.findAll();
        List<RelationPointventeCompagnie> relations = this.repo.findAll();
        LocalDate today = LocalDate.now();

        for (RelationPointventeCompagnie relation : relations) {
            if (relation.getDateFin().isBefore(today)) {
                relation.setActive(false);
                repo.save(relation);
            }
        }

        return relations;
    }
    @Override
    public List<RelationPointventeCompagnieDto> getCompagniesByPointvente(Long pointventeId) {
        List<RelationPointventeCompagnie> relations = repo.findByPointventeId(pointventeId);
        return relations.stream().map(RelationPointventeCompagnieDto::toDto).collect(Collectors.toList());
    }

    @Override
    public void deletePointventeCompagnie(Long id) {
        repo.deleteById(id);

    }

    @Override
    public RelationPointventeCompagnie getPointventeCompagnieByID(Long PointventeCompagnieid) {
        return repo.findById(PointventeCompagnieid).get();
    }
    @Override
    public void updateRelationDates(Long id, LocalDate dateDebut, LocalDate dateFin) {
        RelationPointventeCompagnie existingRelation = getPointventeCompagnieByID(id);

        // Marquer l'ancienne relation comme inactive
        existingRelation.setActive(false);
        repo.save(existingRelation);

        // Créer une nouvelle relation avec les nouvelles dates
        RelationPointventeCompagnie newRelation = new RelationPointventeCompagnie();
        newRelation.setCompagnie(existingRelation.getCompagnie());
        newRelation.setPointvente(existingRelation.getPointvente());
        newRelation.setDateDebut(dateDebut);
        newRelation.setDateFin(dateFin);
        newRelation.setActive(true);

        repo.save(newRelation);
    }

    public List<CompagnieDto> getCompagniesNonLiees(Long pointventeId) {
        List<Long> relatedCompagnieIds = repo.findCompagnieIdsByPointventeId(pointventeId);
        return compagnieRepository.findByIdNotIn(relatedCompagnieIds).stream()
                .map(CompagnieDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RelationPointventeCompagnie> getCompagniesMemePointVente(Long compagnieId, Long pointventeId) {
        return repo.findByCompagnieIdAndPointventeId(compagnieId, pointventeId);
    }

    @Override
    public void updateActiveStatus(Long id, Boolean active) {
        RelationPointventeCompagnie relation = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Relation not found with id " + id));
        relation.setActive(active);
        repo.save(relation);
    }





    @Override
    public void suspendRelation(Long id) {
        RelationPointventeCompagnie existingRelation = getPointventeCompagnieByID(id);
        existingRelation.setActive(false);
        repo.save(existingRelation);
    }

    @Override
    public void suspendRelation(Long id, String reason) {
        RelationPointventeCompagnie existingRelation = getPointventeCompagnieByID(id);
        existingRelation.setActive(false);
        // Enregistrer le motif de la suspension (à adapter selon votre modèle de données)
        existingRelation.setSuspensionReason(reason);
        repo.save(existingRelation);
    }
   /* @Override
    public List<RelationPointventeCompagnie> getInactiveCompagnies() {
        return repo.findByActiveFalse();
    }*/
   @Override
    public List<RelationPointventeCompagnieDto> getInactiveCompagniesByPointventeId(Long pointventeId) {
        List<RelationPointventeCompagnie> inactiveEntities = repo.findByActiveFalseAndPointventeId(pointventeId);
        return inactiveEntities.stream()
                .map(RelationPointventeCompagnieDto::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<RelationPointventeCompagnieDto> getActiveCompagniesByPointventeId(Long pointventeId) {
        List<RelationPointventeCompagnie> activeEntities = repo.findByActiveTrueAndPointventeId(pointventeId);
        return activeEntities.stream()
                .map(RelationPointventeCompagnieDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void changeStatutEtRaison(Long id, Long statutCId, String raison) {
        RelationPointventeCompagnie existingRelation = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RelationPointventeCompagnie not found with id " + id));

        StatutC statutC = statutCReposirory.findById(statutCId)
                .orElseThrow(() -> new ResourceNotFoundException("StatutC not found with id " + statutCId));

        StatutHistoriqueC historique = new StatutHistoriqueC();
        historique.setRelationPointventeCompagnie(existingRelation);
        historique.setStatut(existingRelation.getStatus());
        historique.setDateChangement(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        historique.setDateDebutc(existingRelation.getDateDebut());
        historique.setDateFinc(existingRelation.getDateFin());
        historique.setStatutC(statutC);
        historique.setRaison(raison);  // Assurez-vous que le champ raison existe dans l'entité StatutHistoriqueC

        statutHistoriqueRepository.save(historique);

        existingRelation.setStatus(statutC.getId().toString());
        existingRelation.setSuspensionReason(raison);
        repo.save(existingRelation);
    }

}
