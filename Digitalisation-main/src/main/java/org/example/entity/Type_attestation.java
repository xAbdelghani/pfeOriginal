package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "type_attestation")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Type_attestation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "prix_unitaire", precision = 38, scale = 2)
    private BigDecimal prix_unitaire;

    @Column(name = "devise")
    private String devise;

    @OneToMany(mappedBy = "ownertat", cascade = CascadeType.ALL)
    private List<Attestation> attestations;

    @OneToMany(mappedBy = "ownertatau", cascade = CascadeType.ALL)
    private List<AttestationsAutorisees> attestationsAutorisees;


}
