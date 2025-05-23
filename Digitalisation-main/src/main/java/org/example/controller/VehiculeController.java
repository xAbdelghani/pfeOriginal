package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.VehiculeDto;
import org.example.entity.Vehicule;
import org.example.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/vehicule")
@SecurityRequirement(name = "Keycloak")
public class VehiculeController {
    @Autowired
    private VehiculeService vehiculeService;

    @PostMapping("/save")
    private Long saveVehicule(@RequestBody Vehicule vehicule) {
        vehiculeService.saveorUpdate(vehicule);
        return vehicule.getId();
    }

    @GetMapping(value = "/getall")
    public List<VehiculeDto> getVehicules() {
        List<Vehicule> vehicules = vehiculeService.listAll();
        return vehicules.stream().map(VehiculeDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private VehiculeDto update(@RequestBody Vehicule vehicule, @PathVariable(name = "id") Long Id) {
        vehicule.setId(Id);
        vehiculeService.saveorUpdate(vehicule);
        return VehiculeDto.toDto(vehicule) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteVehicule(@PathVariable("id") Long Id) {
        vehiculeService.deleteVehicule(Id);
    }


    @RequestMapping("/search/{id}")
    private VehiculeDto getVehicules(@PathVariable(name = "id") Long vehiculeid) {
        return VehiculeDto.toDto(vehiculeService.getVehiculeByID(vehiculeid));
    }

    @GetMapping("/modele/{modeleVehiculeId}")
    public List<Vehicule> getVehiculesByModele(@PathVariable Long modeleVehiculeId) {
        return vehiculeService.getVehiculesByModeleVehiculeId(modeleVehiculeId);
    }
}
