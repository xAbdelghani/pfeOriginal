package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.Type_AbonnementDto;
import org.example.Dto.Type_FactureDto;
import org.example.entity.Type_Abonnement;
import org.example.entity.Type_Facture;
import org.example.service.Type_AbonnementService;
import org.example.service.Type_FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/typefacture")
@SecurityRequirement(name = "Keycloak")
public class Type_FactureController {
    @Autowired
    private Type_FactureService type_FactureService;

    @PostMapping("/save")
    private Long savetypeAbonnement(@RequestBody Type_Facture type) {
        type_FactureService.saveorUpdate(type);
        return type.getId();
    }

    @GetMapping(value = "/getall")
    public List<Type_FactureDto> getTypes() {
        List<Type_Facture> typeFactures =type_FactureService.listAll();
        return typeFactures.stream().map(Type_FactureDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private Type_FactureDto update(@RequestBody Type_Facture type, @PathVariable(name = "id") Long Id) {
        type.setId(Id);
        type_FactureService.saveorUpdate(type);
        return Type_FactureDto.toDto(type);

    }
    @DeleteMapping("/delete/{id}")
    private void deleteType(@PathVariable("id") Long Id) {
        type_FactureService.deleteTypeFacture(Id);
    }


    @RequestMapping("/search/{id}")
    private Type_FactureDto getTypes(@PathVariable(name = "id") Long typeFactureid) {
        return Type_FactureDto.toDto(type_FactureService.getTypeFactureByID(typeFactureid));
    }
}
