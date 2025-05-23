package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "soldePrepaye")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SoldePrepaye {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "solde", precision = 10, scale = 2)
    private BigDecimal solde;

    @Column(name = "date_Abonnement")
    private LocalDate date_Abonnement;

    @Column(name = "type")
    private String type;

    @Column(name = "devise")
    private String devise;

    @Column(name = "statut")
    private String statut;

    @Column(name="solde_attestation")
    private int solde_attestation;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerso;


    @ManyToOne
    @JoinColumn(name = "offre_id")
    private Offre ownerpr;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture factures;

    @OneToMany(mappedBy = "ownersl", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StatutHistorique> statutHistorique = new ArrayList<>(); // Initialiser ici

    public SoldePrepaye(BigDecimal solde) {
        this.solde = solde;
    }


}
