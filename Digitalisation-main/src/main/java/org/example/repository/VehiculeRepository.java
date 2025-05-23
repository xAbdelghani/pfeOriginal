package org.example.repository;


import org.example.entity.Vehicule;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculeRepository extends JpaRepositoryImplementation<Vehicule, Long> {
    List<Vehicule> findByModeleVehicule_Id(Long modeleVehiculeId);
    Optional<Vehicule> findByImmatriculation(String immatriculation);
}
