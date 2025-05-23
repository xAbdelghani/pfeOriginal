package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicule")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Vehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "date_Immatriculation")
    private LocalDate date_Immatriculation;

    @Column(name = "immatriculation")
    private String immatriculation;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private Modele_Vehicule modeleVehicule;

    @OneToMany(mappedBy = "vehicule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attestation> attestations = new ArrayList<>();

}
