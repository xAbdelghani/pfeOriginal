package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "agence")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Agence {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "noma", nullable = false)
    private String noma;

    @Column(name = "adressea")
    private String adressea;

    @Column(name = "telephonea")
    private String telephonea;

    @Column(name = "date_debuta")
    private LocalDate date_Debuta;

    @Column(name = "date_fina")
    private LocalDate date_fina;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerag;

}
