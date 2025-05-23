package org.example.service;


import org.example.Dto.AbonnementDto;
import org.example.entity.Abonnement;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AbonnementService {
    void saveorUpdate(Abonnement abonnements,Long id);
    List<Abonnement> listAll();
    void deleteAbonnement(Long id);
    Abonnement getAbonnementByID(Long abonnementid);

    List<Abonnement> getAbonnementsByCompagnie(Long compagnieId);

    AbonnementDto updateAbonnement(Long id, AbonnementDto abonnementDto);
    void updateAbonnementStatus(Long abonnementId, Long statutAbonnementId);
}
