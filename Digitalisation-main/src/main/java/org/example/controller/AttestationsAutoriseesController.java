package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;

import org.example.Dto.AttestationsAutoriseesDto;
import org.example.entity.AttestationsAutorisees;
import org.example.entity.AttestationsAutoriseesKey;
import org.example.entity.Compagnie;
import org.example.service.AttestationsAutoriseesService;
import org.example.service.CompagnieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/attestationAutorisees")
@SecurityRequirement(name = "Keycloak")
public class AttestationsAutoriseesController {
    @Autowired
    private AttestationsAutoriseesService attestationsAutoriseesService;

    @Autowired
    private CompagnieService compagnieService;
    /*@PostMapping("/save")
    private AttestationsAutoriseesKey saveAttestationsAutorisees(@RequestBody AttestationsAutorisees attestationsAutorisees) {
        attestationsAutoriseesService.saveorUpdate(attestationsAutorisees);
        return attestationsAutorisees.getId();
    }*/

    @PostMapping("/save")
    public void save(@RequestBody List<AttestationsAutorisees> attestations) {
        attestationsAutoriseesService.saveAll(attestations);
    }

    @GetMapping(value = "/getall")
    public List<AttestationsAutoriseesDto> getAttestationsAutorisees() {
        List<AttestationsAutorisees> attestationsAutorisees = attestationsAutoriseesService.listAll();
        return attestationsAutorisees.stream().map(AttestationsAutoriseesDto::toDto).collect(Collectors.toList());
    }


    @PutMapping(value = "/edit/{id}")
    private AttestationsAutoriseesDto update(@RequestBody AttestationsAutorisees attestationsAutorisees, @PathVariable(name = "id") AttestationsAutoriseesKey Id) {
        attestationsAutorisees.setId(Id);
        attestationsAutoriseesService.saveorUpdate(attestationsAutorisees);
        return AttestationsAutoriseesDto.toDto(attestationsAutorisees) ;

    }
    @DeleteMapping("/delete/{id}")
    private void deleteAttestationsAutorisees(@PathVariable("id") AttestationsAutoriseesKey Id) {
        attestationsAutoriseesService.deleteAttestationsAutorisees(Id);
    }


    @RequestMapping("/search/{id}")
    private AttestationsAutoriseesDto getAttestationsAutorisees(@PathVariable(name = "id") AttestationsAutoriseesKey attestationsAutoriseesid) {
        return AttestationsAutoriseesDto.toDto(attestationsAutoriseesService.getAttestationsAutoriseesByID(attestationsAutoriseesid));
    }

    @PutMapping("/toggleFlag")
    public void toggleFlag(@RequestBody List<Long> id) {
        attestationsAutoriseesService.toggleFlag(id);
    }

    @GetMapping(value = "/byCompagnieAndFlagTrue/{compagnieId}")
    public List<AttestationsAutoriseesDto> getAttestationsAutoriseesByCompagnieAndFlagTrue(@PathVariable Long compagnieId) {
        Compagnie compagnie = compagnieService.getCompagnieByID(compagnieId);
        List<AttestationsAutorisees> attestationsAutorisees = attestationsAutoriseesService.findByCompagnieAndFlagTrue(compagnie);
        return attestationsAutorisees.stream().map(AttestationsAutoriseesDto::toDto).collect(Collectors.toList());
    }

}
