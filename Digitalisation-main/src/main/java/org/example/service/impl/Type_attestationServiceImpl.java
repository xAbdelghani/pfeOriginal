package org.example.service.impl;

import org.example.entity.*;
import org.example.repository.AttestationsAutoriseesRepository;
import org.example.repository.CompagnieRepository;
import org.example.repository.Type_AbonnementRepository;
import org.example.repository.Type_attestationRepository;
import org.example.service.Type_attestationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Type_attestationServiceImpl implements Type_attestationService {

    @Autowired
    private Type_attestationRepository repo;
    @Autowired
    private AttestationsAutoriseesRepository attestationsAutoriseesRepository;

    @Autowired
    private CompagnieRepository compagnieRepository;
    @Override
    public void saveorUpdate(Type_attestation type_attestation) {
        if(type_attestation.getId() == null){
        Type_attestation typeAttestations = repo.save(type_attestation);
        List<Compagnie> compagnies = compagnieRepository.findAll();

        for (Compagnie compagnie : compagnies) {
            AttestationsAutoriseesKey key = new AttestationsAutoriseesKey(compagnie.getId(), typeAttestations.getId());
            if (!attestationsAutoriseesRepository.existsById(key)) {
                AttestationsAutorisees attestationsAutorisees = new AttestationsAutorisees();
                attestationsAutorisees.setId(key);
                attestationsAutorisees.setOwneratau(compagnie);
                attestationsAutorisees.setOwnertatau(typeAttestations);
                attestationsAutorisees.setFlag(false);
                attestationsAutoriseesRepository.save(attestationsAutorisees);
            }
        }}
        else{
            repo.save(type_attestation);
        }

    }

    @Override
    public List<Type_attestation> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteTypeAttestation(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Type_attestation getTypeAttestationByID(Long typeAttestationid) {
        return repo.findById(typeAttestationid).get();
    }
}
