package org.example.repository;

import org.example.entity.Type_Abonnement;
import org.example.entity.Type_Facture;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface Type_FactureRepository extends JpaRepositoryImplementation<Type_Facture, Long> {
}
