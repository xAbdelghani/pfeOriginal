package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contact")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "nomc", nullable = false)
    private String nomc;


    @Column(name = "prenomc")
    private String prenomc;

    @Column(name = "fax")
    private String fax;

    @Column(name = "telephonec")
    private String telephonec;

    @Column(name = "emailc")
    private String emailc;

    @Column(name = "remarquec")
    private String remarquec;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerco;

    @ManyToOne
    @JoinColumn(name = "fonction_id")
    private Fonction ownerfo;
}
