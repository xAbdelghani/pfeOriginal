package org.example.service;


import org.example.entity.Statut_Att;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface Statut_AttService {
    void saveorUpdate(Statut_Att statutAtt);
    List<Statut_Att> listAll();
    void deleteStatut_Att(Long id);
    Statut_Att getStatut_AttByID(Long statutAttid);
}
