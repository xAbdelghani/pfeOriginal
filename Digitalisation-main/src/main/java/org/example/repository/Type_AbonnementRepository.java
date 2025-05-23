package org.example.repository;

import org.example.entity.Facture;
import org.example.entity.Type_Abonnement;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface Type_AbonnementRepository extends JpaRepositoryImplementation<Type_Abonnement, String> {
}
