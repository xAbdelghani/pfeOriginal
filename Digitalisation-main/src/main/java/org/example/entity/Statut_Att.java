package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "statutAtt")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Statut_Att {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "libelle")
    private String libelles;

    @OneToMany(mappedBy = "statutAtt")
    private List<HistoriqueStatutAtt> historiqueStatutAtts;
}
