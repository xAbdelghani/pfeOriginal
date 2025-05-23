package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modele_Vehicule")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Modele_Vehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "designation")
    private String designation;

    @Column(name = "type")
    private String type;

    @Column(name = "marque")
    private String marque;

    @Column(name = "annee")
    private int annee;

    @Column(name = "puissanceFiscale")
    private Double puissanceFiscale;

    @Column(name = "carburant")
    private String carburant;


    @OneToMany(mappedBy = "modeleVehicule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicule> vehicules = new ArrayList<>();;
}
