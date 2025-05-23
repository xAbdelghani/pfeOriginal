package org.example.repository;


import org.example.entity.Attestation;
import org.example.entity.HistoriqueStatutAtt;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueStatutAttRepository extends JpaRepositoryImplementation<HistoriqueStatutAtt, Long> {
    //List<HistoriqueStatutAtt> findByAttestationOrderByDate_StatutDesc(Attestation attestation);
    List<HistoriqueStatutAtt> findHistoriqueStatutAttByAttestationOrderByDateStatutDesc(Attestation attestation);


}
