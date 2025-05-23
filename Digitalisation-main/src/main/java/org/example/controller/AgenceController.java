package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AgenceDto;

import org.example.entity.Agence;
import org.example.service.AgenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/agence")
@SecurityRequirement(name = "Keycloak")
public class AgenceController {
    @Autowired
    private AgenceService agenceService;

    @PostMapping("/save")
    private Long saveAgence(@RequestBody Agence agence) {
        agenceService.saveorUpdate(agence);
        return agence.getId();
    }

    @GetMapping(value = "/getall")
    public List<AgenceDto> getAgences() {
        return agenceService.listAll().stream().map(AgenceDto::toDto).collect(Collectors.toList());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<AgenceDto> updateSolde(@PathVariable Long id, @RequestBody AgenceDto agenceDto) {
        AgenceDto updatedagence = agenceService.updateagence(id, agenceDto);
        return ResponseEntity.ok(updatedagence);
    }


    @DeleteMapping("/delete/{id}")
    private void deleteAgence(@PathVariable("id") Long Id) {
        agenceService.deleteAgence(Id);
    }


    @RequestMapping("/search/{id}")
    private AgenceDto getAgences(@PathVariable(name = "id") Long fonctionid) {
        return AgenceDto.toDto(agenceService.getAgenceByID(fonctionid));
    }


  @PutMapping("/removeCompany/{id}")
  public ResponseEntity<Long> removeCompanyFromAgence(@PathVariable Long id) {
      Long compagnieId = agenceService.removeCompagnieId(id);
      return ResponseEntity.ok(compagnieId);
  }


    @PutMapping("/reestablishCompany/{id}")
    public ResponseEntity<Void> reestablishCompanyToAgence(@PathVariable Long id) {
        agenceService.reestablishCompagnieId(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/getCompagnieId/{id}")
    public ResponseEntity<Long> getCompagnieIdForAgence(@PathVariable Long id) {
        try {
            // Récupérer l'agence par son ID
            Agence agence = agenceService.getAgenceByID(id);
            // Vérifier si l'agence a une compagnie associée
            if (agence.getOwnerag() != null) {
                // Renvoyer l'ID de la compagnie associée
                return ResponseEntity.ok(agence.getOwnerag().getId());
            } else {
                // Si aucune compagnie n'est associée, renvoyer une réponse avec un statut 404 (Not Found)
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // En cas d'erreur, renvoyer une réponse avec un statut 500 (Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/updateDateFinToToday/{id}")
    public ResponseEntity<Void> updateDateFinToToday(@PathVariable Long id) {
        agenceService.updateDateFinToToday(id);
        return ResponseEntity.ok().build();
    }

}
