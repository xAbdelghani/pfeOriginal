package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.EmbeddedId;

@Entity
@Table(name = "attestationautoriser")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AttestationsAutorisees {
    @EmbeddedId
    private AttestationsAutoriseesKey id;

    @ManyToOne
    @MapsId("idcompagnie")
    @JoinColumn(name = "compagniea_id")
    private Compagnie owneratau;

    @ManyToOne
    @MapsId("idtypeattestation")
    @JoinColumn(name = "typeattestationa_id")
    private Type_attestation ownertatau;

    private boolean flag;


}
