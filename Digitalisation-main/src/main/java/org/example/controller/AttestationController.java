package org.example.controller;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.itextpdf.text.DocumentException;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.AttestationDto;
import org.example.Dto.FactureDto;
import org.example.entity.Attestation;
import org.example.service.AttestationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/attestation")
@SecurityRequirement(name = "Keycloak")
public class AttestationController {
    private  AttestationService attestationService;

    @Autowired
    public AttestationController(AttestationService attestationService) {
        this.attestationService = attestationService;
    }

/*
    @PostMapping("/save")
    private Long saveAttestation(@RequestBody Attestation attestation) {
        attestationService.saveorUpdate(attestation);
        return attestation.getId();
    }*/

   /* @PostMapping("/generer")
    public ResponseEntity<String> genererAttestation(@RequestBody String json) {
        try {
            attestationService.genererAttestation(json);
            return new ResponseEntity<>("Attestations générées avec succès", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }*/

    @PostMapping("/generer")

    public ResponseEntity<Object> genererAttestation(@RequestBody String json) {
        try {
            byte[] pdfData = attestationService.genererAttestation(json);
            ByteArrayResource resource = new ByteArrayResource(pdfData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=attestation.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfData.length)
                    .body(resource);

        } catch (RuntimeException | IOException | DocumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la génération de l'attestation : " + e.getMessage());
        }
    }
    @GetMapping("pdf/{id}")
    public ResponseEntity<Resource> getAttestationById(@PathVariable Long id) {
        try {
            Attestation attestation = attestationService.getAttestationByID(id);
            ByteArrayResource resource = new ByteArrayResource(attestation.getFichierData());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + attestation.getNomFichier())
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(attestation.getFichierData().length)
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }


    @GetMapping("/getbycompanyid/{companyId}")
    public List<AttestationDto> getAttestationsByCompanyId(@PathVariable Long companyId) {
        List<Attestation> attestations = attestationService.getAttestationsByCompanyId(companyId);
        return attestations.stream().map(AttestationDto::toDto).collect(Collectors.toList());
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestPart("fichier") MultipartFile file,
                                             @RequestParam("date_Generation") String dateGenerationStr,
                                             @RequestParam("date_Debut") String dateDebutStr,
                                             @RequestParam("date_Fin") String dateFinStr,
                                             @RequestParam("prix") String prix,
                                             @RequestParam("statut") String statut) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateGeneration = LocalDate.parse(dateGenerationStr, formatter);
            LocalDate dateDebut = LocalDate.parse(dateDebutStr, formatter);
            LocalDate dateFin = LocalDate.parse(dateFinStr, formatter);

            Attestation attestation = new Attestation();
            attestation.setDate_Generation(dateGeneration);
            attestation.setDate_Debut(dateDebut);
            attestation.setDateFin(dateFin);
            /*attestation.setPrix(Double.parseDouble(prix));
            attestation.setStatut(statut);*/

            if (file != null && !file.isEmpty()) {
                attestation.setNomFichier(file.getOriginalFilename());
                attestation.setFichierData(file.getBytes());
            }

            attestationService.saveorUpdate(attestation);
            return ResponseEntity.ok("Enregistrement de l'attestation réussi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Échec de l'enregistrement de l'attestation");
        }
    }
    @GetMapping("/attestations/download/{id}")
    public ResponseEntity<Resource> downloadAttestation(@PathVariable Long id) {
        Attestation attestation = attestationService.getAttestationByID(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attestation.getNomFichier() + "\"")
                .body(new ByteArrayResource(attestation.getFichierData()));
    }

    @GetMapping(value = "/getall")
    public List<AttestationDto> getAttestations() {

        return attestationService.listAll().stream().map(AttestationDto::toDto).collect(Collectors.toList());
    }

    @GetMapping("/attestations/new")
    public void createAttestationForm(Model model) {
        Attestation attestation = new Attestation();
        model.addAttribute("attestation", attestation);

    }

    @PutMapping(value = "/edit/{id}")
    private ResponseEntity<Attestation> update(@RequestPart(value = "file", required = false) MultipartFile file,
                                               @RequestParam("date_Generation") String dateGenerationStr,
                                               @RequestParam("date_Debut") String dateDebutStr,
                                               @RequestParam("date_Fin") String dateFinStr,
                                               @RequestParam("prix") Double prix,
                                               @RequestParam("statut") String statut,
                                               @PathVariable(name = "id") Long Id) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateGeneration = LocalDate.parse(dateGenerationStr, formatter);
            LocalDate dateDebut = LocalDate.parse(dateDebutStr, formatter);
            LocalDate dateFin = LocalDate.parse(dateFinStr, formatter);

            Attestation attestation = attestationService.getAttestationByID(Id);
            attestation.setDate_Generation(dateGeneration);
            attestation.setDate_Debut(dateDebut);
            attestation.setDateFin(dateFin);
            /*attestation.setPrix(prix);
            attestation.setStatut(statut);*/

            if (file != null && !file.isEmpty()) {
                attestation.setNomFichier(file.getOriginalFilename());
                attestation.setFichierData(file.getBytes());
            }

            attestationService.saveorUpdate(attestation);

            return ResponseEntity.ok(attestation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @DeleteMapping("/delete/{id}")
    private void deleteAttestation(@PathVariable("id") Long Id) {
        attestationService.deleteAttestation(Id);
    }


    @RequestMapping("/search/{id}")
    private AttestationDto getAttestation(@PathVariable(name = "id") Long attestationid) {
        return AttestationDto.toDto(attestationService.getAttestationByID(attestationid));
    }

    @PutMapping("/modifier")
    public ResponseEntity<Object> modifierAttestation(@RequestBody String json) {
        try {
            Attestation attestationModifiee = attestationService.modifierAttestation(json);
            byte[] pdfData = attestationService.generatePDF(attestationModifiee);
            ByteArrayResource resource = new ByteArrayResource(pdfData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=attestation_modifiee.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfData.length)
                    .body(resource);
        } catch (RuntimeException | IOException | DocumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la modification de l'attestation : " + e.getMessage());
        }
    }

}
