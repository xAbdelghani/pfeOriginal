package org.example.service;


import org.example.entity.StatutA;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StatutAService {
    void saveorUpdate(StatutA statutAs);
    List<StatutA> listAll();
    void deleteStatusA(Long id);
    StatutA getStatusAByID(Long statutAid);
}
