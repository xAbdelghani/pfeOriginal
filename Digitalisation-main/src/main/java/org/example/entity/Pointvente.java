package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "pointvente")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Pointvente {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "nomp")
    private String nomp;

    @Column(name = "date_debutp")
    private LocalDate date_Debutp;

    @Column(name = "date_finp")
    private LocalDate date_finp;

    @Column(name = "telephonep")
    private String telephonep;

    @Column(name = "emailp")
    private String emailp;


/*
    @ManyToMany(mappedBy = "pointventes")

    private List<Compagnie> compagnies;*/

    @OneToMany(mappedBy = "pointvente", cascade = CascadeType.ALL)
    private List<RelationPointventeCompagnie> relationPointventeCompagnies;



}
