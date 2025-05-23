package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.PointventeDto;
import org.example.entity.Compagnie;
import org.example.entity.Pointvente;
import org.example.service.PointventeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/pointvente")
@SecurityRequirement(name = "Keycloak")
public class PointventeController {
    @Autowired
    private PointventeService pointventeService;

    @PostMapping("/save")
    private Long savePointvente(@RequestBody Pointvente pointvente) {
        pointventeService.saveorUpdate(pointvente);
        return pointvente.getId();
    }

    @GetMapping(value = "/getall")
    public List<PointventeDto> getPointventes() {
        return pointventeService.listAll().stream().map(PointventeDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private PointventeDto update(@RequestBody Pointvente pointvente, @PathVariable(name = "id") Long Id) {
        pointvente.setId(Id);
        pointventeService.saveorUpdate(pointvente);
        return PointventeDto.toDto(pointvente);

    }
    @DeleteMapping("/delete/{id}")
    private void deletePointvente(@PathVariable("id") Long Id) {
        pointventeService.deletePointvente(Id);
    }


    @RequestMapping("/search/{id}")
    private PointventeDto getFactures(@PathVariable(name = "id") Long pointventeid) {
        return PointventeDto.toDto(pointventeService.getPointventeByID(pointventeid));
    }

    /*@GetMapping("/notrelated/{compagnieId}")
    public List<PointventeDto> getUnrelatedPointventes(@PathVariable Long compagnieId) {
        return pointventeService.findUnrelatedPointventes(compagnieId).stream()
                .map(PointventeDto::toDto)
                .collect(Collectors.toList());
    }*/
   /* @PutMapping("/update/{id}")
    public ResponseEntity<Pointvente> updateCompagnie(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long compagnieId = request.get("compagnieid");
        pointventeService.updatePointvente(id, compagnieId);
        return ResponseEntity.ok().build();
    }*/
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateCompagniee(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Long compagnieId = Long.valueOf(request.get("compagnieId").toString());
        LocalDate dateDebut = LocalDate.parse(request.get("dateDebut").toString());
        LocalDate dateFin = LocalDate.parse(request.get("dateFin").toString());

        pointventeService.updatePointvente(id, compagnieId, dateDebut, dateFin);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateDates/{id}")
    public ResponseEntity<Void> updateDates(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long compagnieId = Long.valueOf(request.get("compagnieId").toString());
            LocalDate dateDebut = request.get("dateDebut") != null ? LocalDate.parse(request.get("dateDebut").toString()) : null;
            LocalDate dateFin = request.get("dateFin") != null ? LocalDate.parse(request.get("dateFin").toString()) : null;

            pointventeService.updatePointvente(id, compagnieId, dateDebut, dateFin);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }




}
