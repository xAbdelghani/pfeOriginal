package org.example.service;

import org.example.entity.Compagnie;
import org.example.entity.Facture;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FactureService {
    void saveorUpdate(Facture factures);
    List<Facture> listAll();
    void deleteFacture(Long id);
    Facture getFactureByID(Long factureid);

    List<Facture> getFacturesByCompagnie(Long compagnieId);
}
