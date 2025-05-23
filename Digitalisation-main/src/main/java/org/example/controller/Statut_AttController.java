package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.Statut_AttDto;
import org.example.entity.Statut_Att;
import org.example.service.Statut_AttService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/statutAtt")
@SecurityRequirement(name = "Keycloak")
public class Statut_AttController {
    @Autowired
    private Statut_AttService statut_AttService;

    @PostMapping("/save")
    private Long saveStatut_Att(@RequestBody Statut_Att statut_Att) {
        statut_AttService.saveorUpdate(statut_Att);
        return statut_Att.getId();
    }

    @GetMapping(value = "/getall")
    public List<Statut_AttDto> getStatut_Atts() {
        List<Statut_Att> statut_Atts = statut_AttService.listAll();
        return statut_Atts.stream().map(Statut_AttDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private Statut_AttDto update(@RequestBody Statut_Att statut_Att, @PathVariable(name = "id") Long Id) {
        statut_Att.setId(Id);
        statut_AttService.saveorUpdate(statut_Att);
        return Statut_AttDto.toDto(statut_Att) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteStatut_Att(@PathVariable("id") Long Id) {
        statut_AttService.deleteStatut_Att(Id);
    }


    @RequestMapping("/search/{id}")
    private Statut_AttDto getStatut_Atts(@PathVariable(name = "id") Long statut_Attid) {
        return Statut_AttDto.toDto(statut_AttService.getStatut_AttByID(statut_Attid));
    }
}
