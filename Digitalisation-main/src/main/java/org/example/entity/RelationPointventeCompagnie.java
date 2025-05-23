package org.example.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "relationpointventecompagnie")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RelationPointventeCompagnie {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie compagnie;

    @ManyToOne
    @JoinColumn(name = "pointvente_id")
    private Pointvente pointvente;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "active")
    private boolean active;
    @Column(name = "suspensionReason")
    private String suspensionReason;
    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "relationPointventeCompagnie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StatutHistoriqueC> statutHistoriquec = new ArrayList<>();;



}
