package org.example.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "statut_historique")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatutHistorique {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "statut")
    private String statut;

    @Column(name = "date")
    private String date;

    @Column(name = "raison")
    private String raison;

    @ManyToOne
    @JoinColumn(name = "abonnement_id")
    private Abonnement ownerst;

    @ManyToOne
    @JoinColumn(name = "soldeprepaye_id")
    private SoldePrepaye ownersl;

    @ManyToOne
    @JoinColumn(name = "idStatutA")
    private  StatutA statutA;
}
