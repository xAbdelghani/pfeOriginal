package org.example.repository;


import org.example.entity.Fonction;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface FonctionRepository extends JpaRepositoryImplementation<Fonction, Long> {
}
