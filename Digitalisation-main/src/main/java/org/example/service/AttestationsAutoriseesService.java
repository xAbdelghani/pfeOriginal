package org.example.service;



import org.example.entity.AttestationsAutorisees;
import org.example.entity.AttestationsAutoriseesKey;
import org.example.entity.Compagnie;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface AttestationsAutoriseesService {
    void saveorUpdate(AttestationsAutorisees attestationsAutorisees);
    List<AttestationsAutorisees> listAll();
    void deleteAttestationsAutorisees(AttestationsAutoriseesKey id);
    AttestationsAutorisees getAttestationsAutoriseesByID(AttestationsAutoriseesKey attestationsAutoriseesid);
    void saveAll(List<AttestationsAutorisees> attestations);
    //void createDefaultRelationships();
    void toggleFlag(List<Long> ids);

    List<AttestationsAutorisees> findByCompagnieAndFlagTrue(Compagnie compagnie);

}
