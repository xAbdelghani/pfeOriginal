package org.example.service.impl;


import org.example.Dto.AbonnementDto;
import org.example.entity.*;
import org.example.repository.AbonnementRepository;
import org.example.repository.CompagnieRepository;
import org.example.repository.StatutAReposirory;
import org.example.repository.StatutHistoriqueRepository;
import org.example.service.AbonnementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AbonnementServiceImpl implements AbonnementService {
    @Autowired
    private AbonnementRepository repo;

    @Autowired
    private CompagnieRepository compagnieRepository;
    @Autowired
    private StatutHistoriqueRepository statutHistoriqueRepository;
    @Autowired
    private StatutAReposirory statutAReposirory;
    public void saveorUpdate(Abonnement abonnements, Long Id) {
        StatutA statutA= statutAReposirory.findById(Id).orElse(null);
        Abonnement abonnement= repo.save(abonnements);
        if(statutA != null){
            StatutHistorique statutHistorique = new StatutHistorique();
            statutHistorique.setOwnerst(abonnement);
            statutHistorique.setStatutA(statutA);
            statutHistorique.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            statutHistoriqueRepository.save(statutHistorique);
        }

    }




    public AbonnementDto updateAbonnement(Long id, AbonnementDto abonnementDto) {
        Abonnement abonnement = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Abonnement not found with id " + id));

        // Update basic attributes
        abonnement.setMontant(abonnementDto.getMontant());
        abonnement.setDate_Abonnement(abonnementDto.getDate_Abonnement());
        abonnement.setDate_Fin(abonnementDto.getDate_Fin());
        abonnement.setType(abonnementDto.getType());
        abonnement.setDevise(abonnementDto.getDevise());

        // Check if statut has changed
        if (!abonnement.getStatut().equals(abonnementDto.getStatut())) {
            StatutA statutA = statutAReposirory.findById(Long.parseLong(abonnementDto.getStatut())).orElse(null);
            StatutHistorique historique = new StatutHistorique();
            historique.setStatutA(statutA);
            historique.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            historique.setRaison(abonnementDto.getRaison());
            historique.setOwnerst(abonnement);
            statutHistoriqueRepository.save(historique);

            abonnement.setStatut(statutA.getLibellep());
        }

        // Update compagnie
        Compagnie compagnie = compagnieRepository.findById(abonnementDto.getCompagnieId())
                .orElseThrow(() -> new ResourceNotFoundException("Compagnie not found with id " + abonnementDto.getCompagnieId()));
        abonnement.setOwnerab(compagnie);

        // Save updated abonnement
        repo.save(abonnement);
        return AbonnementDto.toDto(abonnement);
    }

    public List<Abonnement> listAll() {

        return this.repo.findAll();
    }


    public void deleteAbonnement(Long id) {

        repo.deleteById(id);
    }

    public Abonnement getAbonnementByID(Long abonnementid) {

        return repo.findById(abonnementid).get();
    }

    @Override
    public List<Abonnement> getAbonnementsByCompagnie(Long compagnieId) {
        return repo.findByOwnerabId(compagnieId);
    }
    @Override
    public void updateAbonnementStatus(Long abonnementId, Long statutAbonnementId) {
        // Fetch the abonnement
        Abonnement abonnement = repo.findById(abonnementId)
                .orElseThrow(() -> new RuntimeException("Abonnement not found"));

        // Fetch the new status
        StatutA statutAbonnement = statutAReposirory.findById(statutAbonnementId)
                .orElseThrow(() -> new RuntimeException("StatutAbonnement not found"));

        // Update the abonnement (if needed, assuming abonnement has a current status field)
        // abonnement.setStatutAbonnement(statutAbonnement);

        // Create a new historiqueStatutA entry
        StatutHistorique historiqueStatutA = new StatutHistorique();
        historiqueStatutA.setOwnerst(abonnement);
        historiqueStatutA.setStatutA(statutAbonnement);
        historiqueStatutA.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // Save the historiqueStatutA
        statutHistoriqueRepository.save(historiqueStatutA);
    }
}
