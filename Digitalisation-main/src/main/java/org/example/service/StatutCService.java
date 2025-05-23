package org.example.service;

import org.example.entity.StatutC;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StatutCService {
    void saveorUpdate(StatutC statutCs);
    List<StatutC> listAll();
    void deleteStatusC(Long id);
    StatutC getStatusCByID(Long statutCid);
}
