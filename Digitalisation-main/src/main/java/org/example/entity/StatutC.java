package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "statutC")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatutC {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libellec;

    @OneToMany(mappedBy = "statutC", cascade = CascadeType.ALL)
    private List<StatutHistoriqueC> statutHistoriquecs;
}
