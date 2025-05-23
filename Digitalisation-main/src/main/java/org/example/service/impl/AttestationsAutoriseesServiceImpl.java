package org.example.service.impl;


import jakarta.transaction.Transactional;
import org.example.entity.AttestationsAutorisees;
import org.example.entity.AttestationsAutoriseesKey;
import org.example.entity.Compagnie;
import org.example.entity.Type_attestation;
import org.example.repository.AttestationsAutoriseesRepository;
import org.example.repository.CompagnieRepository;
import org.example.repository.Type_attestationRepository;
import org.example.service.AttestationsAutoriseesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AttestationsAutoriseesServiceImpl implements AttestationsAutoriseesService {
    @Autowired
    private AttestationsAutoriseesRepository repo;
    @Autowired
    private CompagnieRepository compagnieRepository;

    @Autowired
    private Type_attestationRepository typeAttestationRepository;
    @Override
    public void saveorUpdate(AttestationsAutorisees offre) {
        repo.save(offre);
    }


    @Override
    public List<AttestationsAutorisees> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteAttestationsAutorisees(AttestationsAutoriseesKey id) {
        repo.deleteById(id);
    }

    @Override
    public AttestationsAutorisees getAttestationsAutoriseesByID(AttestationsAutoriseesKey attestationsAutoriseesid) {
        return repo.findById(attestationsAutoriseesid).get();
    }
    @Override
    public void saveAll(List<AttestationsAutorisees> attestations) {
        for (AttestationsAutorisees attestation : attestations) {
            Compagnie compagnie = compagnieRepository.findById(attestation.getOwneratau().getId()).orElse(null);
            Type_attestation typeAttestation = typeAttestationRepository.findById(attestation.getOwnertatau().getId()).orElse(null);

            if (compagnie != null && typeAttestation != null) {
                attestation.setOwneratau(compagnie);
                attestation.setOwnertatau(typeAttestation);
                repo.save(attestation);
            } else {
                throw new IllegalArgumentException("Invalid compagnie or typeAttestation ID");
            }
        }
    }

    @Override
    @Transactional
    public void toggleFlag(List<Long> ids) {
        Compagnie compagnie= compagnieRepository.findById(ids.get(0)).orElse(null);
        Type_attestation typeAttestation= typeAttestationRepository.findById(ids.get(1)).orElse(null);
        AttestationsAutorisees attestation = repo.findByOwneratauAndOwnertatau(compagnie,typeAttestation);
        attestation.setFlag(!attestation.isFlag());
        repo.save(attestation);
    }

    @Override
    public List<AttestationsAutorisees> findByCompagnieAndFlagTrue(Compagnie compagnie) {
        return repo.findByOwneratauAndFlagTrue(compagnie);
    }
    /*@Override
    public void createDefaultRelationships() {
        List<Compagnie> compagnies = compagnieRepository.findAll();
        List<Type_attestation> typeAttestations = typeAttestationRepository.findAll();

        for (Compagnie compagnie : compagnies) {
            for (Type_attestation typeAttestation : typeAttestations) {
                AttestationsAutoriseesKey key = new AttestationsAutoriseesKey(compagnie.getId(), typeAttestation.getId());
                if (!repo.existsById(key)) {
                    AttestationsAutorisees attestationsAutorisees = new AttestationsAutorisees();
                    attestationsAutorisees.setId(key);
                    attestationsAutorisees.setOwneratau(compagnie);
                    attestationsAutorisees.setOwnertatau(typeAttestation);
                    attestationsAutorisees.setFlag(false);
                    repo.save(attestationsAutorisees);
                }
            }
        }
    }*/
}
