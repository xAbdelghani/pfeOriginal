package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.service.RelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/relations")
@SecurityRequirement(name = "Keycloak")
public class RelationController {
    @Autowired
    private RelationService relationService;

    /*@DeleteMapping("/compagnie/{compagnieId}/pointvente/{pointventeId}")
    public ResponseEntity<String> dissocierCompagnieEtPointvente(@PathVariable Long compagnieId, @PathVariable Long pointventeId) {
        boolean success = relationService.dissocierCompagnieEtPointvente(compagnieId, pointventeId);
        if (success) {
            return ResponseEntity.ok("Relation dissociée avec succès");
        } else {
            return ResponseEntity.status(404).body("Compagnie ou Point de Vente non trouvé, ou relation inexistante");
        }
    }

    @PostMapping("/compagnie/{compagnieId}/pointvente")
    public ResponseEntity<?> addCourtiersToCompany(@PathVariable Long compagnieId, @RequestBody List<Long> pointVenteIds) {
        try {
            relationService.addCourtiersToCompany(compagnieId, pointVenteIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }*/


}
