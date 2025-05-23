package org.example.service;


import org.example.Dto.SoldePrepayeDto;
import org.example.entity.SoldePrepaye;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface SoldePrepayeService {
    //void saveorUpdate(SoldePrepaye soldePrepayes, Long Id);
    void saveorUpdate(SoldePrepaye soldePrepaye);
    List<SoldePrepaye> listAll();
    void deleteSoldePrepaye(Long id);
    SoldePrepaye getSoldePrepayeByID(Long soldePrepayeid);

    SoldePrepayeDto updatesolde(Long id, SoldePrepayeDto soldePrepayeDto);

    List<SoldePrepaye> getSoldeByCompagnie(Long compagnieId);
    SoldePrepayeDto Update(Long id, SoldePrepayeDto soldePrepayeDto);
}
