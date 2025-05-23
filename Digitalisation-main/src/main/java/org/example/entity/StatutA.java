package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "statutA")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatutA {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libellep;

    @OneToMany(mappedBy = "statutA")
    private List<StatutHistorique> statutHistoriques;

}
