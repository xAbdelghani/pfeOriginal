package org.example.service;


import org.example.Dto.AgenceDto;
import org.example.entity.Agence;
import org.example.entity.Fonction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AgenceService {
    void saveorUpdate(Agence agences);
    List<Agence> listAll();
    void deleteAgence(Long id);
    Agence getAgenceByID(Long agenceid);

    AgenceDto updateagence(Long id, AgenceDto agenceDto);
    //void removeCompagnieId(Long id);

    void updateDateFinToToday(Long id);

    void reestablishCompagnieId(Long agenceId);

    Long removeCompagnieId(Long id);
}
