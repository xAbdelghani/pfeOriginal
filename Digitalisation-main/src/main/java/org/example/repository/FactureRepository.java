package org.example.repository;

import org.example.entity.Facture;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FactureRepository extends JpaRepositoryImplementation<Facture, Long> {
    List<Facture> findByOwnerfaId(Long compagnieId);
}
