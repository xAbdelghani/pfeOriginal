package org.example.service;

import org.example.entity.Type_Abonnement;
import org.example.entity.Type_Facture;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface Type_FactureService {
    void saveorUpdate(Type_Facture typeFactures);
    List<Type_Facture> listAll();
    void deleteTypeFacture(Long id);
    Type_Facture getTypeFactureByID(Long typeFactureid);
}
