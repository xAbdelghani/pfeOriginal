package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "offre")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Offre {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @OneToMany(mappedBy = "ownerpr", cascade = CascadeType.ALL)

    private List<SoldePrepaye> soldePrepayes;
}
