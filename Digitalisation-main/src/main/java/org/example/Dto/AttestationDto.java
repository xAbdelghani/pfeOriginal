package org.example.Dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Attestation;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttestationDto {
    private Long id;

    private LocalDate date_Generation;

    private LocalDate date_Debut;

    private LocalDate date_Fin;

    private String nomfichier;

    private byte[] fichierData;

    private String raison_social;

    private String libelle;

    private BigDecimal prix_unitaire;

    private String devise;
    private String referenceFlotte;
    private String cheminDepotAttestationGeneree;

    public static AttestationDto toDto(Attestation attestation){
        return AttestationDto.builder()
                .id(attestation.getId())
                .date_Generation(attestation.getDate_Generation())
                .date_Debut(attestation.getDate_Debut())
                .date_Fin(attestation.getDateFin())
                .nomfichier(attestation.getNomFichier())
                .fichierData(attestation.getFichierData())
                .raison_social(attestation.getOwnerat() != null ? attestation.getOwnerat().getRaisonSocial() : null)
                .prix_unitaire(attestation.getOwnertat()!=null ? attestation.getOwnertat().getPrix_unitaire() :null )
                .devise(attestation.getOwnertat()!=null ? attestation.getOwnertat().getDevise() :null )
                .libelle(attestation.getOwnertat()!=null ? attestation.getOwnertat().getLibelle() :null )
               /* .prix(attestation.getPrix())
                .statut(attestation.getStatut())*/
                .build();
    }

    static public Attestation convertAttestationDtoToEntity(AttestationDto attestationDto) {
        Attestation attestation = new Attestation();
        attestation.setId(attestationDto.getId());
        attestation.setDate_Generation(attestationDto.getDate_Generation());
        attestation.setDate_Debut(attestationDto.getDate_Debut());
        attestation.setDateFin(attestationDto.getDate_Fin());
        attestation.setNomFichier(attestationDto.getNomfichier());
        attestation.setFichierData(attestationDto.getFichierData());
        /*attestation.setPrix(attestationDto.getPrix());
        attestation.setStatut(attestationDto.getStatut());*/

        return attestation;
    }

}
