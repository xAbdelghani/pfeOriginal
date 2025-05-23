package org.example.service;


import org.example.entity.StatutF;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StatutFService {
    void saveorUpdate(StatutF statutF);
    List<StatutF> listAll();
    void deleteStatutF(Long id);
    StatutF getStatutFByID(Long statutFid);
}
