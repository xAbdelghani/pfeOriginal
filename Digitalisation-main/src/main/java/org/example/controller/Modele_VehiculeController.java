package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.Modele_VehiculeDto;
import org.example.entity.Modele_Vehicule;
import org.example.service.Modele_VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/modele")
@SecurityRequirement(name = "Keycloak")
public class Modele_VehiculeController {
    @Autowired
    private Modele_VehiculeService modele_VehiculeService;

    @PostMapping("/save")
    private Long saveModele_Vehicule(@RequestBody Modele_Vehicule modele_Vehicule) {
        modele_VehiculeService.saveorUpdate(modele_Vehicule);
        return modele_Vehicule.getId();
    }

    @GetMapping(value = "/getall")
    public List<Modele_VehiculeDto> getModele_Vehicules() {
        List<Modele_Vehicule> modele_Vehicules = modele_VehiculeService.listAll();
        return modele_Vehicules.stream().map(Modele_VehiculeDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private Modele_VehiculeDto update(@RequestBody Modele_Vehicule modele_Vehicule, @PathVariable(name = "id") Long Id) {
        modele_Vehicule.setId(Id);
        modele_VehiculeService.saveorUpdate(modele_Vehicule);
        return Modele_VehiculeDto.toDto(modele_Vehicule) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteModele_Vehicule(@PathVariable("id") Long Id) {
        modele_VehiculeService.deleteModele_Vehicule(Id);
    }


    @RequestMapping("/search/{id}")
    private Modele_VehiculeDto getModele_Vehicules(@PathVariable(name = "id") Long modele_Vehiculeid) {
        return Modele_VehiculeDto.toDto(modele_VehiculeService.getModele_VehiculeByID(modele_Vehiculeid));
    }
}
