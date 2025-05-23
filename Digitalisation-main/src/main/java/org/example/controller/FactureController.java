package org.example.controller;


import com.itextpdf.text.DocumentException;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AbonnementDto;
import org.example.Dto.FactureDto;
import org.example.entity.Compagnie;
import org.example.entity.Facture;
import org.example.service.CompagnieService;
import org.example.service.FactureService;
import org.example.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//import com.itextpdf.text.DocumentException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/facture")
@SecurityRequirement(name = "Keycloak")
public class FactureController {
    @Autowired
    private FactureService factureService;

    @Autowired
    private PdfService pdfService;
    @PostMapping("/save")
    private Long saveFacture(@RequestBody Facture facture) {
        factureService.saveorUpdate(facture);
        return facture.getId();
    }

    @GetMapping(value = "/getall")
    public List<FactureDto> getFactures() {
        return factureService.listAll().stream().map(FactureDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private FactureDto update(@RequestBody Facture facture, @PathVariable(name = "id") Long Id) {
        facture.setId(Id);
        factureService.saveorUpdate(facture);
            return FactureDto.toDto(facture);

    }
    @DeleteMapping("/delete/{id}")
    private void deleteFacture(@PathVariable("id") Long Id) {
        factureService.deleteFacture(Id);
    }


    @RequestMapping("/search/{id}")
    private FactureDto getFactures(@PathVariable(name = "id") Long factureid) {
        return FactureDto.toDto(factureService.getFactureByID(factureid));
    }

    @GetMapping(value = "/getall/{compagnieId}")
    public List<FactureDto> getFacturesByCompagnie(@PathVariable Long compagnieId) {
        return factureService.getFacturesByCompagnie(compagnieId).stream().map(FactureDto::toDto).collect(Collectors.toList());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadFacture(@PathVariable Long id) throws DocumentException, IOException {
        FactureDto factureDto = FactureDto.toDto(factureService.getFactureByID(id));


        System.out.println("Facture ID: " + factureDto.getId());
        System.out.println("Date: " + factureDto.getDate_Debutt());
        System.out.println("Type: " + factureDto.getTypeF());
        System.out.println("Taxe: " + factureDto.getTaxe());
        System.out.println("Prime: " + factureDto.getPrime());
        System.out.println("Date Echeance: " + factureDto.getDate_Echeance());
        System.out.println("Date Reglement: " + factureDto.getDate_Reglement());
        System.out.println("Statut: " + factureDto.getStatut());

        ByteArrayResource resource = pdfService.generatePdf(factureDto);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture_" + id + ".pdf")
                .body(resource);
    }

}
