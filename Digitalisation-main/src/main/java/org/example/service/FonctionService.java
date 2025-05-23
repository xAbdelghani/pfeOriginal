package org.example.service;

import org.example.entity.Fonction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FonctionService {
    void saveorUpdate(Fonction fonctions);
    List<Fonction> listAll();
    void deleteFonction(Long id);
    Fonction getFonctionByID(Long fonctionid);
}
