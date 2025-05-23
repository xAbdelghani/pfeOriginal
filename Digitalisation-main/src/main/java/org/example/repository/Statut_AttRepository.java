package org.example.repository;

import org.example.entity.Statut_Att;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Statut_AttRepository  extends JpaRepositoryImplementation<Statut_Att, Long> {
    Optional<Statut_Att> findByLibelles(String libelles);
}
