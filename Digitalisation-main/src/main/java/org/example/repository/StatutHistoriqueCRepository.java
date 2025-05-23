package org.example.repository;


import org.example.entity.StatutHistoriqueC;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface StatutHistoriqueCRepository extends JpaRepositoryImplementation<StatutHistoriqueC, Long> {
}
