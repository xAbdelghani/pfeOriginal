package org.example.repository;

import org.example.entity.Offre;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreRepository extends JpaRepositoryImplementation<Offre, Long> {
}
