package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.StatutADto;
import org.example.entity.StatutA;
import org.example.service.StatutAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/statutA")
@SecurityRequirement(name = "Keycloak")
public class StatutAController {
    @Autowired
    private StatutAService statutAService;

    @PostMapping("/save")
    private Long saveStatutA(@RequestBody StatutA statutA) {
        statutAService.saveorUpdate(statutA);
        return statutA.getId();
    }

    @GetMapping(value = "/getall")
    public List<StatutADto> getStatutAs() {
        List<StatutA> statutAS = statutAService.listAll();
        return statutAS.stream().map(StatutADto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private StatutADto update(@RequestBody StatutA statutA, @PathVariable(name = "id") Long Id) {
        statutA.setId(Id);
        statutAService.saveorUpdate(statutA);
        return StatutADto.toDto(statutA) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteStatutA(@PathVariable("id") Long Id) {
        statutAService.deleteStatusA(Id);
    }


    @RequestMapping("/search/{id}")
    private StatutADto getStatutAs(@PathVariable(name = "id") Long statutAid) {
        return StatutADto.toDto(statutAService.getStatusAByID(statutAid));
    }
}
