package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historiqueStatutF")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoriqueStatutF {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "statut")
    private String statut;

    @Column(name = "date_statut_facture")
    private String date_statut_facture;

    @Column(name = "raison")
    private String raison;


    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture factureh;

    @ManyToOne
    @JoinColumn(name = "statut_id")
    private  StatutF statutF;
}
