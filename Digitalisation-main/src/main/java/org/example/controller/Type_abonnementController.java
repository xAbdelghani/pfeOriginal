package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.Type_AbonnementDto;
import org.example.entity.Facture;
import org.example.entity.Type_Abonnement;
import org.example.service.FactureService;
import org.example.service.Type_AbonnementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/typeabonnement")
@SecurityRequirement(name = "Keycloak")
public class Type_abonnementController {
    @Autowired
    private Type_AbonnementService type_AbonnementService;

    @PostMapping("/save")
    private Long savetypeAbonnement(@RequestBody Type_Abonnement type) {
        type_AbonnementService.saveorUpdate(type);
        return type.getId();
    }

    @GetMapping(value = "/getall")
    public List<Type_AbonnementDto> getTypes() {
        List<Type_Abonnement> typeAbonnements = type_AbonnementService.listAll();
        return typeAbonnements.stream().map(Type_AbonnementDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private Type_AbonnementDto update(@RequestBody Type_Abonnement type, @PathVariable(name = "id") Long Id) {
        type.setId(Id);
        type_AbonnementService.saveorUpdate(type);
        return Type_AbonnementDto.toDto(type) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteType(@PathVariable("id") String Id) {
        type_AbonnementService.deleteTypeAbonnement(Id);
    }


    @RequestMapping("/search/{id}")
    private Type_AbonnementDto getTypes(@PathVariable(name = "id") String typeAbonnementid) {
        return Type_AbonnementDto.toDto(type_AbonnementService.getTypeAbonnementByID(typeAbonnementid));
    }
}
