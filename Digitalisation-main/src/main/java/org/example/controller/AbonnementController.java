package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AbonnementDto;
import org.example.Dto.CompagnieDto;
import org.example.entity.Abonnement;
import org.example.entity.Compagnie;
import org.example.entity.StatutHistorique;
import org.example.service.AbonnementService;
import org.example.service.CompagnieService;
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
@RequestMapping("api/v1/abonnement")
@SecurityRequirement(name = "Keycloak")
public class AbonnementController {
    @Autowired
    private AbonnementService abonnementService;

    private static final Logger LOGGER = Logger.getLogger(AbonnementController.class.getName());

    @PostMapping("/save/{id}")
    private Long saveCompagnie(@RequestBody Abonnement abonnement,@PathVariable Long id) {

        abonnementService.saveorUpdate(abonnement,id);
        return abonnement.getId();
    }

    @GetMapping(value = "/getall")
    public List<AbonnementDto> getAbonnements() {

        return abonnementService.listAll().stream().map(AbonnementDto::toDto).collect(Collectors.toList());
    }


    @PutMapping("/edit/{id}")
    public ResponseEntity<AbonnementDto> updateAbonnement(@PathVariable Long id, @RequestBody AbonnementDto abonnementDto) {
        LOGGER.info("Données reçues pour la mise à jour : " + abonnementDto);
        try {
            AbonnementDto updatedAbonnement = abonnementService.updateAbonnement(id, abonnementDto);
            return ResponseEntity.ok(updatedAbonnement);
        } catch (Exception e) {
            LOGGER.severe("Erreur lors de la mise à jour de l'abonnement: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    private AbonnementDto getUserById(@PathVariable("id") Long id) {
        return AbonnementDto.toDto(abonnementService.getAbonnementByID(id));

    }


    @DeleteMapping("/delete/{id}")
    private void deleteAbonnement(@PathVariable("id") Long Id) {

        abonnementService.deleteAbonnement(Id);
    }


    @RequestMapping("/search/{id}")
    private Abonnement getAbonnement(@PathVariable(name = "id") Long abonnementid) {
        return abonnementService.getAbonnementByID(abonnementid);
    }

    @GetMapping("/getall/{compagnieId}")
    public List<AbonnementDto> getAbonnementsByCompagnie(@PathVariable Long compagnieId) {
        return abonnementService.getAbonnementsByCompagnie(compagnieId).stream().map(AbonnementDto::toDto).collect(Collectors.toList());
    }

    @GetMapping("/get/{id}")
    public AbonnementDto getAbonnementById(@PathVariable(name = "id") Long abonnementId) {
        return AbonnementDto.toDto(abonnementService.getAbonnementByID(abonnementId));
    }
    @PutMapping("/{abonnementId}/status/{statutAbonnementId}")
    public void updateAbonnementStatus(
            @PathVariable Long abonnementId,
            @PathVariable Long statutAbonnementId) {
        abonnementService.updateAbonnementStatus(abonnementId, statutAbonnementId);
    }

}
