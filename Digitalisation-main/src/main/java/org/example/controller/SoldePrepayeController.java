package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AbonnementDto;
import org.example.Dto.OffreDto;
import org.example.Dto.SoldePrepayeDto;
import org.example.entity.Offre;
import org.example.entity.SoldePrepaye;
import org.example.entity.StatutHistorique;
import org.example.service.SoldePrepayeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/solde")
@SecurityRequirement(name = "Keycloak")
public class SoldePrepayeController {
    @Autowired
    private SoldePrepayeService soldePrepayeService;

    private static final Logger LOGGER = Logger.getLogger(AbonnementController.class.getName());

    /*@PostMapping("/save/{id}")
    private Long saveSoldePrepaye(@RequestBody SoldePrepaye soldePrepaye,@PathVariable Long id) {


        soldePrepayeService.saveorUpdate(soldePrepaye,id);
        return soldePrepaye.getId();
    }*/
    @PostMapping("/save")
    private Long saveOffre(@RequestBody SoldePrepaye soldePrepaye) {
        soldePrepayeService.saveorUpdate(soldePrepaye);
        return soldePrepaye.getId();
    }

    @GetMapping(value = "/getall")
    public List<SoldePrepayeDto> getSoldePrepayes() {
        return soldePrepayeService.listAll().stream().map(SoldePrepayeDto::toDto).collect(Collectors.toList());
    }

   /* @PutMapping(value = "/edit/{id}")
    private SoldePrepayeDto update(@RequestBody SoldePrepaye soldePrepaye, @PathVariable(name = "id") Long Id) {
        soldePrepaye.setId(Id);
        soldePrepayeService.saveorUpdate(soldePrepaye);
        return SoldePrepayeDto.toDto(soldePrepaye);

    }*/

    @GetMapping("/getall/{compagnieId}")
    public List<SoldePrepayeDto> getSoldeByCompagnie(@PathVariable Long compagnieId) {
        return soldePrepayeService.getSoldeByCompagnie(compagnieId).stream().map(SoldePrepayeDto::toDto).collect(Collectors.toList());
    }

    @PutMapping("/edit/{id}")
    private SoldePrepayeDto update(@RequestBody SoldePrepayeDto soldePrepaye, @PathVariable(name = "id") Long Id) {
        soldePrepaye.setId(Id);
        soldePrepayeService.Update(Id,soldePrepaye);
        return soldePrepaye ;

    }
   /* public ResponseEntity<SoldePrepayeDto> updateSolde(@PathVariable Long id, @RequestBody SoldePrepayeDto soldePrepayeDto) {
        LOGGER.info("Données reçues pour la mise à jour : " + soldePrepayeDto);
        try {
            SoldePrepayeDto updatedSolde = soldePrepayeService.updatesolde(id, soldePrepayeDto);
            return ResponseEntity.ok(updatedSolde);
        } catch (Exception e) {
            LOGGER.severe("Erreur lors de la mise à jour de l'abonnement: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }


    }*/
    @DeleteMapping("/delete/{id}")
    private void deleteSoldePrepaye(@PathVariable("id") Long Id) {
        soldePrepayeService.deleteSoldePrepaye(Id);
    }

    @GetMapping("/{id}")
    public SoldePrepayeDto getUserById(@PathVariable("id") Long id) {
        return SoldePrepayeDto.toDto(soldePrepayeService.getSoldePrepayeByID(id));
    }
    @RequestMapping("/search/{id}")
    private SoldePrepayeDto getSoldePrepayes(@PathVariable(name = "id") Long soldePrepayeid) {
        return SoldePrepayeDto.toDto(soldePrepayeService.getSoldePrepayeByID(soldePrepayeid));
    }

    private void addStatusHistoryEntry(SoldePrepaye soldePrepaye, String statut) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = dateFormat.format(new Date());

        StatutHistorique statutHistorique = new StatutHistorique();
        statutHistorique.setStatut(statut);
        statutHistorique.setDate(formattedDate);
        statutHistorique.setOwnersl(soldePrepaye);

        soldePrepaye.getStatutHistorique().add(statutHistorique);
    }
}
