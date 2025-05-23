package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.FonctionDto;
import org.example.entity.Fonction;
import org.example.service.FonctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/fonction")
@SecurityRequirement(name = "Keycloak")
public class FonctionController {
    @Autowired
    private FonctionService fonctionService;

    @PostMapping("/save")
    private Long saveFonction(@RequestBody Fonction fonction) {
        fonctionService.saveorUpdate(fonction);
        return fonction.getId();
    }

    @GetMapping(value = "/getall")
    public List<FonctionDto> getFonctions() {
        return fonctionService.listAll().stream().map(FonctionDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private FonctionDto update(@RequestBody Fonction fonction, @PathVariable(name = "id") Long Id) {
        fonction.setId(Id);
        fonctionService.saveorUpdate(fonction);
        return FonctionDto.toDto(fonction);

    }
    @DeleteMapping("/delete/{id}")
    private void deleteFonction(@PathVariable("id") Long Id) {
        fonctionService.deleteFonction(Id);
    }


    @RequestMapping("/search/{id}")
    private FonctionDto getFonctions(@PathVariable(name = "id") Long fonctionid) {
        return FonctionDto.toDto(fonctionService.getFonctionByID(fonctionid));
    }
}
