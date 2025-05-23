package org.example.repository;


import org.example.entity.Abonnement;
import org.example.entity.StatutHistorique;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface StatutHistoriqueRepository extends JpaRepositoryImplementation<StatutHistorique, Long> {

}
