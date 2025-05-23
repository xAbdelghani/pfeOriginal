package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.CompagnieDto;
import org.example.Dto.RelationPointventeCompagnieDto;
import org.example.entity.RelationPointventeCompagnie;
import org.example.service.CompagniePointVenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/relationcp")
@SecurityRequirement(name = "Keycloak")
public class CompagniePointVenteController {
    @Autowired
    private CompagniePointVenteService compagniePointVenteService;

    @PostMapping("/save/{id}")
    private Long saveRelation(@RequestBody RelationPointventeCompagnie relationPointventeCompagnie,@PathVariable Long id) {
        compagniePointVenteService.saveorUpdate(relationPointventeCompagnie,id);
        return relationPointventeCompagnie.getId();
    }


    @GetMapping(value = "/getall")
    public List<RelationPointventeCompagnieDto> getRelations() {
      //  compagniePointVenteService.updateRelationStatuses();
        return compagniePointVenteService.listAll().stream().map(RelationPointventeCompagnieDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<?> update(@RequestBody Map<String, Object> payload, @PathVariable(name = "id") Long id) {
        try {
            RelationPointventeCompagnie updatedRelation = compagniePointVenteService.updateRelation(id, payload);
            return ResponseEntity.ok(RelationPointventeCompagnieDto.toDto(updatedRelation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }




    @DeleteMapping("/delete/{id}")
    private void deleteRelation(@PathVariable("id") Long Id) {
        compagniePointVenteService.deletePointventeCompagnie(Id);
    }


    @RequestMapping("/search/{id}")
    private RelationPointventeCompagnieDto getRelations(@PathVariable(name = "id") Long relationid) {
        return RelationPointventeCompagnieDto.toDto(compagniePointVenteService.getPointventeCompagnieByID(relationid));
    }

    @PutMapping("/updateDates/{id}")
    public ResponseEntity<Void> updateRelationDates(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        LocalDate dateDebut = LocalDate.parse(request.get("dateDebut").toString());
        LocalDate dateFin = LocalDate.parse(request.get("dateFin").toString());

        compagniePointVenteService.updateRelationDates(id, dateDebut, dateFin);
        return ResponseEntity.ok().build();
    }
    // CompagniePointVenteController.java
    @GetMapping("/getCompagniesNonLiees/{pointventeId}")
    public List<CompagnieDto> getCompagniesNonLiees(@PathVariable Long pointventeId) {
        return compagniePointVenteService.getCompagniesNonLiees(pointventeId);
    }


    @GetMapping("/compagniesMemePointVente/{compagnieId}/{pointventeId}")
    public List<RelationPointventeCompagnieDto> getCompagniesMemePointVente(@PathVariable Long compagnieId, @PathVariable Long pointventeId) {
        List<RelationPointventeCompagnie> compagnies = compagniePointVenteService.getCompagniesMemePointVente(compagnieId, pointventeId);
        return compagnies.stream().map(RelationPointventeCompagnieDto::toDto).collect(Collectors.toList());
    }
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<Void> updateActiveStatus(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Boolean active = (Boolean) request.get("active");
        compagniePointVenteService.updateActiveStatus(id, active);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/suspend/{id}")
    public ResponseEntity<Void> suspendRelation(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String reason = (String) request.get("reason");
        compagniePointVenteService.suspendRelation(id, reason);
        return ResponseEntity.ok().build();
    }

   @GetMapping("/inactiveByPointventeId/{pointventeId}")
   public List<RelationPointventeCompagnieDto> getInactiveCompagniesByPointventeId(@PathVariable Long pointventeId) {
       return compagniePointVenteService.getInactiveCompagniesByPointventeId(pointventeId);
   }
    @GetMapping("/activeByPointventeId/{pointventeId}")
    public List<RelationPointventeCompagnieDto> getActiveCompagniesByPointventeId(@PathVariable Long pointventeId) {
        return compagniePointVenteService.getActiveCompagniesByPointventeId(pointventeId);
    }
    @GetMapping("/getCompagniesByPointvente/{pointventeId}")
    public List<RelationPointventeCompagnieDto> getCompagniesByPointvente(@PathVariable Long pointventeId) {
        return compagniePointVenteService.getCompagniesByPointvente(pointventeId);
    }
    @PutMapping("/changeStatutEtRaison/{id}")
    public ResponseEntity<Void> changeStatutEtRaison(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Long statutCId = Long.valueOf((Integer) request.get("statutCId"));
        String raison = (String) request.get("raison");

        compagniePointVenteService.changeStatutEtRaison(id, statutCId, raison);
        return ResponseEntity.ok().build();
    }
}
