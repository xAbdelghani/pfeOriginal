package org.example.service;


import org.example.Dto.CompagnieDto;
import org.example.Dto.RelationPointventeCompagnieDto;
import org.example.entity.RelationPointventeCompagnie;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public interface CompagniePointVenteService {
    void saveorUpdate(RelationPointventeCompagnie relationPointventeCompagnies, Long Id);
    List<RelationPointventeCompagnie> listAll();
    void deletePointventeCompagnie(Long id);
    RelationPointventeCompagnie getPointventeCompagnieByID(Long pointventecompagnieid);

    void updateRelationDates(Long id, LocalDate dateDebut, LocalDate dateFin);

    List<CompagnieDto> getCompagniesNonLiees(Long pointventeId);


    List<RelationPointventeCompagnie> getCompagniesMemePointVente(Long compagnieId, Long pointventeId);

    void updateActiveStatus(Long id, Boolean active);

    //void updateRelationStatuses();

    void suspendRelation(Long id);

    void suspendRelation(Long id, String reason);
  //  List<RelationPointventeCompagnie> getInactiveCompagnies();
   // List<RelationPointventeCompagnie> getActiveCompagnies();

    List<RelationPointventeCompagnieDto> getActiveCompagniesByPointventeId(Long pointventeId);

    List<RelationPointventeCompagnieDto> getInactiveCompagniesByPointventeId(Long pointventeId);

    List<RelationPointventeCompagnieDto> getCompagniesByPointvente(Long pointventeId);
    //void update(RelationPointventeCompagnie newRelation, Long id, Long statutCId);
    RelationPointventeCompagnie updateRelation(Long id, Map<String, Object> payload);
    void changeStatutEtRaison(Long id, Long statutCId, String raison);

}
