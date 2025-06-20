package org.example.repository;

import org.example.entity.HistoriqueStatutF;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriqueStatutFRepository extends JpaRepositoryImplementation<HistoriqueStatutF, Long> {
}
