package org.example.service.impl;


import org.example.Dto.SoldePrepayeDto;
import org.example.entity.*;
import org.example.repository.CompagnieRepository;
import org.example.repository.SoldePrepayeRepository;
import org.example.repository.StatutAReposirory;
import org.example.repository.StatutHistoriqueRepository;
import org.example.service.SoldePrepayeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SoldePrepayeServiceImpl implements SoldePrepayeService {
    @Autowired
    private SoldePrepayeRepository repo;
    @Autowired
    private StatutAReposirory statutAReposirory;

    @Autowired
    private StatutHistoriqueRepository statutHistoriqueRepository;


    @Override
    public void saveorUpdate(SoldePrepaye soldePrepaye) {
        repo.save(soldePrepaye);
        Compagnie compagnie = soldePrepaye.getOwnerso();
        if (compagnie != null) {
            compagnie = compagnieRepository.findById(compagnie.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Compagnie not found with id " ));
            compagnie.setSoldeCompagnie(compagnie.getSoldeCompagnie().add(soldePrepaye.getSolde()));
            compagnieRepository.save(compagnie);
        }
    }


    @Override

    public SoldePrepayeDto Update(Long id, SoldePrepayeDto soldePrepayeDto) {
        SoldePrepaye soldePrepaye = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("SoldePrepaye not found with id " + id));
        BigDecimal oldSolde = soldePrepaye.getSolde();
        BigDecimal newSolde = soldePrepayeDto.getSolde();
        BigDecimal difference = newSolde.subtract(oldSolde);
        // Update basic attributes
        soldePrepaye.setSolde(soldePrepayeDto.getSolde());
        soldePrepaye.setDate_Abonnement(soldePrepayeDto.getDate_Abonnement());
        soldePrepaye.setDevise(soldePrepayeDto.getDevise());
        soldePrepaye.setType(soldePrepayeDto.getType());
        Compagnie compagnie = compagnieRepository.findById(soldePrepayeDto.getCompagnieId())
                .orElseThrow(() -> new ResourceNotFoundException("Compagnie not found with id " + soldePrepayeDto.getCompagnieId()));
        soldePrepaye.setOwnerso(compagnie);
        compagnie.setSoldeCompagnie(compagnie.getSoldeCompagnie().add(difference));
        compagnieRepository.save(compagnie);
        repo.save(soldePrepaye);
        /*compagnie.updateSoldeCompagnie();
        compagnieRepository.save(compagnie);*/
        return SoldePrepayeDto.toDto(soldePrepaye);
    }

    @Autowired
    private CompagnieRepository compagnieRepository;
    @Override
    public List<SoldePrepaye> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteSoldePrepaye(Long id) {

        SoldePrepaye soldePrepaye = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SoldePrepaye not found with id " + id));

        Compagnie compagnie = soldePrepaye.getOwnerso();
        compagnie.setSoldeCompagnie(compagnie.getSoldeCompagnie().subtract(soldePrepaye.getSolde()));
        compagnieRepository.save(compagnie);

        repo.deleteById(id);

    }

   @Override
   public SoldePrepayeDto updatesolde(Long id, SoldePrepayeDto soldePrepayeDto) {
       SoldePrepaye soldePrepaye = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("SoldePrepaye not found with id " + id));

       // Update basic attributes
       soldePrepaye.setSolde(soldePrepayeDto.getSolde());
       soldePrepaye.setDate_Abonnement(soldePrepayeDto.getDate_Abonnement());
       soldePrepaye.setDevise(soldePrepayeDto.getDevise());
       soldePrepaye.setType(soldePrepayeDto.getType());

       // Check if statut has changed
       if (!soldePrepaye.getStatut().equals(soldePrepayeDto.getStatut())) {
           StatutA statutA = statutAReposirory.findById(Long.parseLong(soldePrepayeDto.getStatut())).orElse(null);
           StatutHistorique historique = new StatutHistorique();
           historique.setStatutA(statutA);
           historique.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
           historique.setRaison(soldePrepayeDto.getRaison());
           historique.setOwnersl(soldePrepaye);
           statutHistoriqueRepository.save(historique);

           soldePrepaye.setStatut(statutA.getLibellep());
       }

       // Update compagnie
       Compagnie compagnie = compagnieRepository.findById(soldePrepayeDto.getCompagnieId())
               .orElseThrow(() -> new ResourceNotFoundException("Compagnie not found with id " + soldePrepayeDto.getCompagnieId()));
       soldePrepaye.setOwnerso(compagnie);




       // Save updated soldePrepaye
       repo.save(soldePrepaye);
       return SoldePrepayeDto.toDto(soldePrepaye);
   }


    @Override
    public SoldePrepaye getSoldePrepayeByID(Long soldePrepayeid) {
        return repo.findById(soldePrepayeid).get();
    }

    @Override
    public List<SoldePrepaye> getSoldeByCompagnie(Long compagnieId) {
        return repo.findByOwnersoId(compagnieId);
    }
}
