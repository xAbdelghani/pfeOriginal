package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.StatutFDto;
import org.example.entity.StatutF;
import org.example.service.StatutFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/statutF")
@SecurityRequirement(name = "Keycloak")
public class StatutFController {
    @Autowired
    private StatutFService statutFService;

    @PostMapping("/save")
    private Long saveStatutF(@RequestBody StatutF statutF) {
        statutFService.saveorUpdate(statutF);
        return statutF.getId();
    }

    @GetMapping(value = "/getall")
    public List<StatutFDto> getStatutFs() {
        List<StatutF> statutFs = statutFService.listAll();
        return statutFs.stream().map(StatutFDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private StatutFDto update(@RequestBody StatutF statutF, @PathVariable(name = "id") Long Id) {
        statutF.setId(Id);
        statutFService.saveorUpdate(statutF);
        return StatutFDto.toDto(statutF) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteStatutF(@PathVariable("id") Long Id) {
        statutFService.deleteStatutF(Id);
    }


    @RequestMapping("/search/{id}")
    private StatutFDto getStatutFs(@PathVariable(name = "id") Long statutFid) {
        return StatutFDto.toDto(statutFService.getStatutFByID(statutFid));
    }
}
