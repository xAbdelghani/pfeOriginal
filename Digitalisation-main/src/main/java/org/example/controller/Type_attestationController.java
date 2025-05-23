package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.Type_attestationDto;
import org.example.entity.Type_attestation;
import org.example.service.Type_attestationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/typeattestation")
@SecurityRequirement(name = "Keycloak")
public class Type_attestationController {
    @Autowired
    private Type_attestationService type_attestationService;

    @PostMapping("/save")
    private Long savetypeattestation(@RequestBody Type_attestation type) {
        type_attestationService.saveorUpdate(type);
        return type.getId();
    }

    @GetMapping(value = "/getall")
    public List<Type_attestationDto> getTypes() {
        List<Type_attestation> typeAttestations = type_attestationService.listAll();
        return typeAttestations.stream().map(Type_attestationDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private Type_attestationDto update(@RequestBody Type_attestation type, @PathVariable(name = "id") Long Id) {
        type.setId(Id);
        type_attestationService.saveorUpdate(type);
        return Type_attestationDto.toDto(type) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteType(@PathVariable("id") Long Id) {
        type_attestationService.deleteTypeAttestation(Id);
    }


    @RequestMapping("/search/{id}")
    private Type_attestationDto getTypes(@PathVariable(name = "id") Long typeAttestationtid) {
        return Type_attestationDto.toDto(type_attestationService.getTypeAttestationByID(typeAttestationtid));
    }
}
