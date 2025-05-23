package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "compagnies")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Compagnie {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "raison_social")
    private String raisonSocial;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "email")
    private String email;

    @Column(name = "statut")
    private String statut;

    @Column(name = "password")
    private String Password;

    @Column(name = "soldecompagnie", precision = 10, scale = 2)
    private BigDecimal soldeCompagnie = BigDecimal.ZERO;

    @OneToMany(mappedBy = "ownerab", cascade = CascadeType.ALL)

    private List<Abonnement> abonnements;

    @OneToMany(mappedBy = "ownerag", cascade = CascadeType.ALL)

    private List<Agence> agences;

    @OneToMany(mappedBy = "ownerso", cascade = CascadeType.ALL)

    private List<SoldePrepaye> soldePrepayes;

    @OneToMany(mappedBy = "ownerat", cascade = CascadeType.ALL)
    private List<Attestation> attestations;

    @OneToMany(mappedBy = "owneratau", cascade = CascadeType.ALL)
    private List<AttestationsAutorisees> attestationsAutorisees;

    @OneToMany(mappedBy = "ownerfa", cascade = CascadeType.ALL)
    private List<Facture> factures;

    @OneToMany(mappedBy = "ownerco", cascade = CascadeType.ALL)
    private List<Contact> contacts;

    @OneToMany(mappedBy = "ownerus", cascade = CascadeType.ALL)
    private List<User> users;

    @OneToMany(mappedBy = "compagnie", cascade = CascadeType.ALL)
    private List<RelationPointventeCompagnie> relationPointventeCompagnies;

    @OneToMany(mappedBy = "compagnies", cascade = CascadeType.ALL)
    private List<Notification> notifications;


    @ManyToOne
    @JoinColumn(name = "type_id")
    private Role ownerco;

    public List<Abonnement> getAbonnements() {
        return abonnements;
    }
}
