package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.OffreDto;
import org.example.entity.Offre;
import org.example.service.OffreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/offre")
@SecurityRequirement(name = "Keycloak")
public class OffreController {
    @Autowired
    private OffreService offreService;

    @PostMapping("/save")
    private Long saveOffre(@RequestBody Offre offre) {
        offreService.saveorUpdate(offre);
        return offre.getId();
    }

    @GetMapping(value = "/getall")
    public List<OffreDto> getTypes() {
        List<Offre> offres = offreService.listAll();
        return offres.stream().map(OffreDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private OffreDto update(@RequestBody Offre offre, @PathVariable(name = "id") Long Id) {
        offre.setId(Id);
        offreService.saveorUpdate(offre);
        return OffreDto.toDto(offre) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteType(@PathVariable("id") Long Id) {
        offreService.deleteOffre(Id);
    }


    @RequestMapping("/search/{id}")
    private OffreDto getTypes(@PathVariable(name = "id") Long offreid) {
        return OffreDto.toDto(offreService.getOffreByID(offreid));
    }
}
