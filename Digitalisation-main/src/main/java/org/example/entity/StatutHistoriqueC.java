package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "statut_historiquec")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatutHistoriqueC {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "statut")
    private String statut;

    @Column(name = "dateChangement")
    private String dateChangement;

    @Column(name = "dateDebutc")
    private LocalDate dateDebutc;

    @Column(name = "dateFinc")
    private LocalDate dateFinc;

    @Column(name = "raison")
    private String raison;

    @ManyToOne
    @JoinColumn(name = "idStatutC")
    private  StatutC statutC;

    @ManyToOne
    @JoinColumn(name = "relation_id")
    private  RelationPointventeCompagnie relationPointventeCompagnie;
}
