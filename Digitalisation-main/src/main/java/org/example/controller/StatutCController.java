package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.StatutCDto;
import org.example.entity.StatutC;
import org.example.service.StatutCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/statutC")
@SecurityRequirement(name = "Keycloak")
public class StatutCController {
    @Autowired
    private StatutCService statutCService;

    @PostMapping("/save")
    private Long saveStatutC(@RequestBody StatutC statutC) {
        statutCService.saveorUpdate(statutC);
        return statutC.getId();
    }

    @GetMapping(value = "/getall")
    public List<StatutCDto> getStatutCs() {
        List<StatutC> statutCS = statutCService.listAll();
        return statutCS.stream().map(StatutCDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private StatutCDto update(@RequestBody StatutC statutC, @PathVariable(name = "id") Long Id) {
        statutC.setId(Id);
        statutCService.saveorUpdate(statutC);
        return StatutCDto.toDto(statutC) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteStatutC(@PathVariable("id") Long Id) {
        statutCService.deleteStatusC(Id);
    }


    @RequestMapping("/search/{id}")
    private StatutCDto getStatutAs(@PathVariable(name = "id") Long statutCid) {
        return StatutCDto.toDto(statutCService.getStatusCByID(statutCid));
    }
}
