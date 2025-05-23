package org.example.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "abonnement")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Abonnement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "montant", precision = 10, scale = 2)
    private BigDecimal montant;


    @Column(name = "date_Abonnement")
    private LocalDate date_Abonnement;

    @Column(name = "date_Fin")
    private LocalDate date_Fin;

    @Column(name = "type")
    private String type;

    @Column(name = "devise")
    private String devise;

    @Column(name = "statut")
    private String statut;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerab;

    @ManyToOne
    @JoinColumn(name = "typeabonnement_id")
    private Type_Abonnement ownertab;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facturea;

    @OneToMany(mappedBy = "ownerst", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StatutHistorique> statutHistorique = new ArrayList<>();;



}
