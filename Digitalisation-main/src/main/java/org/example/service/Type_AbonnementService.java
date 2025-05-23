package org.example.service;

import org.example.entity.Facture;
import org.example.entity.Type_Abonnement;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface Type_AbonnementService {
    void saveorUpdate(Type_Abonnement typeAbonnements);
    List<Type_Abonnement> listAll();
    void deleteTypeAbonnement(String id);
    Type_Abonnement getTypeAbonnementByID(String typeAbonnementid);
}
