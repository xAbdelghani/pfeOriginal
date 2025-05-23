package org.example.service;

import org.example.entity.Offre;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OffreService {
    void saveorUpdate(Offre offre);
    List<Offre> listAll();
    void deleteOffre(Long id);
    Offre getOffreByID(Long offreid);
}
