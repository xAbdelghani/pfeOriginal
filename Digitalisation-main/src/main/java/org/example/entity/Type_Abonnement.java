package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "type_Abonnement")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Type_Abonnement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "duree")
    private Double duree;

    @Column(name = "unite")
    private String unite;

    @OneToMany(mappedBy = "ownertab", cascade = CascadeType.ALL)

    private List<Abonnement> abonnements;


}
