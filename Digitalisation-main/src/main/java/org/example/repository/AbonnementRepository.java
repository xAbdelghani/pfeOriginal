package org.example.repository;

import org.example.entity.Abonnement;

import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbonnementRepository extends JpaRepositoryImplementation<Abonnement, Long> {
    List<Abonnement> findByOwnerabId(Long compagnieId);
}
