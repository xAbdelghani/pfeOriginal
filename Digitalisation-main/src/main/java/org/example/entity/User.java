package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "utilisateur")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password")
    private String Password;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private Role ownerro;

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerus;

}
