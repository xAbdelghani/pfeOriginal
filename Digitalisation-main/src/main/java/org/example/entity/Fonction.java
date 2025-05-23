package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "fonction")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Fonction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "qualite")
    private String qualite;

    @OneToMany(mappedBy = "ownerfo", cascade = CascadeType.ALL)
    private List<Contact> contacts;
}
