package org.example.service;


import org.example.entity.Type_Abonnement;
import org.example.entity.Type_attestation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface Type_attestationService {
    void saveorUpdate(Type_attestation type_attestation);
    List<Type_attestation> listAll();
    void deleteTypeAttestation(Long id);
    Type_attestation getTypeAttestationByID(Long typeAttestationid);
}
