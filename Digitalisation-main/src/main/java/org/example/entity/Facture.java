package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facture")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "date_Debutt")
    private LocalDate date_Debutt;

    @Column(name = "typeF")
    private String typeF;

    @Column(name = "date_Echeance")
    private LocalDate date_Echeance;

    @Column(name = "date_Reglement")
    private LocalDate date_Reglement;

    @Column(name = "statut")
    private String statut;

    @Column(name = "taxe")
    private Double taxe;

    @Column(name = "prime")
    private Double prime;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerfa;

    @ManyToOne
    @JoinColumn(name = "typefacture_id")
    private Type_Facture ownertfa;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attestation> attestations = new ArrayList<>();


    @OneToMany(mappedBy = "factures", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SoldePrepaye> soldePrepayes = new ArrayList<>();


    @OneToMany(mappedBy = "facturea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Abonnement> abonnements = new ArrayList<>();

    @OneToMany(mappedBy = "factureh", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoriqueStatutF> historiqueStatutFs = new ArrayList<>();

}
