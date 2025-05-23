package org.example.repository;

import org.example.entity.Type_attestation;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface Type_attestationRepository extends JpaRepositoryImplementation<Type_attestation, Long> {
}
