package org.example.service;

import org.example.Dto.PointventeDto;
import org.example.entity.Facture;
import org.example.entity.Pointvente;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface PointventeService {
    void saveorUpdate(Pointvente pointventes);
    List<Pointvente> listAll();
    void deletePointvente(Long id);
    Pointvente getPointventeByID(Long pointventeid);
    //List<Pointvente> findUnrelatedPointventes(Long compagnieId);
    //void updatePointvente(Long id, Long compagnieId);

    void updatePointvente(Long pointventeId, Long compagnieId, LocalDate dateDebut, LocalDate dateFin);
}
