package org.example.repository;


import org.example.entity.AttestationsAutorisees;
import org.example.entity.AttestationsAutoriseesKey;
import org.example.entity.Compagnie;
import org.example.entity.Type_attestation;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttestationsAutoriseesRepository extends JpaRepositoryImplementation<AttestationsAutorisees, AttestationsAutoriseesKey> {
    AttestationsAutorisees findByOwneratauAndOwnertatau(Compagnie owneratau, Type_attestation ownertatau);
    List<AttestationsAutorisees> findByOwneratauAndFlagTrue(Compagnie owneratau);
}
