package org.example.controller;


import jakarta.persistence.Column;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AbonnementDto;
import org.example.Dto.CompagnieDto;
import org.example.Dto.ContactDto;
import org.example.Dto.FactureDto;
import org.example.entity.Compagnie;
import org.example.service.CompagnieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/compagnie")
@SecurityRequirement(name = "Keycloak")
@PreAuthorize("hasAuthority('client-abonnement') or hasAuthority('admin')")
public class CompagnieController {
    @Autowired
    private CompagnieService compagnieService;



    @PostMapping("/save")
    private Long saveCompagnie(@RequestBody Compagnie compagnie) {

        compagnieService.saveorUpdate(compagnie);
        return compagnie.getId();
    }

    @GetMapping(value = "/getall")
    public List<CompagnieDto> getCompagnies() {

        return compagnieService.listAll().stream().map(CompagnieDto::toDto).collect(Collectors.toList());
    }

   @PutMapping(value = "/edit/{id}")
    private CompagnieDto update(@RequestBody Compagnie compagnie, @PathVariable(name = "id") Long Id) {


        compagnie.setId(Id);

        // Vérifier si une compagnie avec cet ID existe
        Compagnie existingCompagnie = compagnieService.getCompagnieByID(Id);
        if (existingCompagnie != null) {
            // Mettre à jour les détails de la compagnie
            existingCompagnie.setNom(compagnie.getNom());
            existingCompagnie.setRaisonSocial(compagnie.getRaisonSocial());
            existingCompagnie.setEmail(compagnie.getEmail());
            existingCompagnie.setTelephone(compagnie.getTelephone());
            existingCompagnie.setAdresse(compagnie.getAdresse());

            existingCompagnie.setStatut(compagnie.getStatut());
            if (compagnie.getAbonnements() != null) {
                existingCompagnie.getAbonnements().clear(); // Supprimer tous les abonnements existants
                existingCompagnie.getAbonnements().addAll(compagnie.getAbonnements()); // Ajouter les nouveaux abonnements
            }

            // Mettre à jour les contacts
            if (compagnie.getContacts() != null) {
                existingCompagnie.getContacts().clear(); // Supprimer tous les contacts existants
                existingCompagnie.getContacts().addAll(compagnie.getContacts()); // Ajouter les nouveaux contacts
            }

            // Mettre à jour les soldePrepayes, agences, attestations, factures de la même manière





            // Enregistrer les modifications de la compagnie
            compagnieService.Update(existingCompagnie);
            return CompagnieDto.toDto(existingCompagnie);
        } else {
            // La compagnie avec l'ID donné n'existe pas
            // Gérer cette situation en conséquence, peut-être lever une exception
            return null;
        }

    }


    @PutMapping("/{compagnieId}")
    public ResponseEntity<CompagnieDto> updateCompagnie(@PathVariable Long compagnieId, @RequestBody CompagnieDto compagnieDto) {
        CompagnieDto updatedCompagnie = compagnieService.updateCompagniee(compagnieId, compagnieDto);
        return ResponseEntity.ok(updatedCompagnie);
    }

    @PutMapping("/update-login/{id}")
    public ResponseEntity<Void> updateLoginAndGeneratePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String nom = request.get("nom");
        compagnieService.updateLoginAndGeneratePassword(id, nom);

        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCompagniee(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Long pointventeId = Long.valueOf(request.get("pointventeId").toString());
        LocalDate dateDebut = LocalDate.parse(request.get("dateDebut").toString());
        LocalDate dateFin = LocalDate.parse(request.get("dateFin").toString());

        compagnieService.updateCompagnie(id, pointventeId, dateDebut, dateFin);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/Login")
    public ResponseEntity<List<CompagnieDto>> getCompagniesWithNonNullNom() {
        List<CompagnieDto> compagnies = compagnieService.getCompagniesWithNonNullNom();
        return ResponseEntity.ok(compagnies);
    }

    @GetMapping("/{id}")
    private CompagnieDto getCompagnies(@PathVariable("id") Long id) {

        return CompagnieDto.toDto(compagnieService.getCompagnieByID(id));
    }

    @GetMapping("/null")
    public ResponseEntity<List<CompagnieDto>> getCompagniesWithNullNom() {
        List<CompagnieDto> compagnies = compagnieService.getCompagniesWithNullNom();
        return ResponseEntity.ok(compagnies);
    }
    @PutMapping("/transfer/{id}")
    public ResponseEntity<Void> transferLoginAndPasswordToNull(@PathVariable Long id) {
        compagnieService.transferLoginAndPasswordToNull(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    private void deleteCompagnie(@PathVariable("id") Long Id) {
        System.out.println(Id +"id------------------------------------");
        compagnieService.deleteCompagnie(Id);
    }


    @RequestMapping("/search/{id}")
    private CompagnieDto getCompagnie(@PathVariable(name = "id") Long compagnieid) {
        return CompagnieDto.toDto(compagnieService.getCompagnieByID(compagnieid));

    }


    @GetMapping("/email/{email}")
    public ResponseEntity<CompagnieDto> getCompagnieByEmail(@PathVariable String email) {
        Optional<Compagnie> compagnie = compagnieService.findCompagnieByEmail(email);
        return compagnie.map(comp -> ResponseEntity.ok(CompagnieDto.toDto(comp)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/id-by-email")
    public ResponseEntity<Long> getCompagnieIdByEmail(@RequestParam String email) {
        Long compagnieId = compagnieService.findCompagnieIdByEmail(email);
        if (compagnieId != null) {
            return ResponseEntity.ok(compagnieId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

