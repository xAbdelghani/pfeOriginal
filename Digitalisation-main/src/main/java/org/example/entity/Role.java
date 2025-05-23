package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "type")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "typee")
    private String typee;

    @OneToMany(mappedBy = "ownerco", cascade = CascadeType.ALL)

    private List<Compagnie> compagnies;

    @OneToMany(mappedBy = "ownerro", cascade = CascadeType.ALL)

    private List<User> users;
}
