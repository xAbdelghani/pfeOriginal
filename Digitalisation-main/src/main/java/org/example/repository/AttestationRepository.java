package org.example.repository;

import org.example.entity.Attestation;
import org.example.entity.Vehicule;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttestationRepository extends JpaRepositoryImplementation<Attestation, Long> {
    //List<Attestation> findByVehicule(Vehicule vehicule);
    List<Attestation> findByOwneratId(Long compagnieId); // Ajout de la méthode de recherche par ID de compagnie
    List<Attestation> findByVehicule(Vehicule vehicule);

    //List<Attestation> findByDate_Fin(LocalDate dateFin);
    List<Attestation> findByDateFin(LocalDate dateFin);


}
