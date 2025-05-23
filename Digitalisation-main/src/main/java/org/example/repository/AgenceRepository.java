package org.example.repository;

import org.example.entity.Abonnement;
import org.example.entity.Agence;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenceRepository extends JpaRepositoryImplementation<Agence, Long> {
}
