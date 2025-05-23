package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "statutF")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StatutF {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libellef;

    @OneToMany(mappedBy = "statutF", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoriqueStatutF> historiqueStatutFs = new ArrayList<>();

}
