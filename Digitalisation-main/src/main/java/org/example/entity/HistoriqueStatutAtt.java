package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Locale;

@Entity
@Table(name = "historiqueStatutAtt")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoriqueStatutAtt {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "statut")
    private String statut;

    @Column(name = "date_Statut")
    private String dateStatut;

    @Column(name = "raison")
    private String raison;

    @ManyToOne
    @JoinColumn(name = "Attestation_id")
    private Attestation attestation;

    @ManyToOne
    @JoinColumn(name = "StatutAtt_id")
    private  Statut_Att statutAtt;
}
