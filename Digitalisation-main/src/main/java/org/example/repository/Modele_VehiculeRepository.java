package org.example.repository;


import org.example.entity.Modele_Vehicule;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Modele_VehiculeRepository  extends JpaRepositoryImplementation<Modele_Vehicule, Long> {
    Optional<Modele_Vehicule> findByDesignationAndMarqueAndTypeAndAnnee(String designation, String marque, String type, int annee);
}
