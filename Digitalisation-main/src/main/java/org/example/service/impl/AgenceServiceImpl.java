package org.example.service.impl;


import org.example.Dto.AgenceDto;

import org.example.entity.Agence;
import org.example.entity.Compagnie;
import org.example.entity.SoldePrepaye;
import org.example.repository.AgenceRepository;
import org.example.repository.CompagnieRepository;
import org.example.service.AgenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AgenceServiceImpl implements AgenceService {
    @Autowired
    private AgenceRepository repo;

    @Autowired
    private CompagnieRepository compagnieRepo;

    private Long temporaryCompanyId;
    @Override
    public void saveorUpdate(Agence agences) {
        if (agences.getDate_fina() != null) {
            agences.setStatus("Clôture");
        }else {
            agences.setStatus("Ouvert");
        }
        repo.save(agences);
    }

    @Override
    public List<Agence> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteAgence(Long id) {
        repo.deleteById(id);

    }

    @Override
    public Agence getAgenceByID(Long agenceid) {
        return repo.findById(agenceid).get();
    }

    @Override
    public AgenceDto updateagence(Long id, AgenceDto agenceDto) {
        Agence agence =repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agence not found\" +id "));
        agence.setNoma(agenceDto.getNoma());
        agence.setAdressea(agenceDto.getAdressea());
        agence.setTelephonea(agenceDto.getTelephonea());
        agence.setDate_Debuta(agenceDto.getDate_Debuta());
        agence.setDate_fina(agenceDto.getDate_fina());
        if (agence.getDate_fina() != null) {
            agence.setStatus("Clôture");
        } else {
            agence.setStatus(agenceDto.getStatus());
        }

        repo.save(agence);
        return agenceDto.toDto(agence);
    }


    @Override
    public Long removeCompagnieId(Long id) {
        Agence agence = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agence not found" + id));
        if (agence.getOwnerag() != null) {
            temporaryCompanyId = agence.getOwnerag().getId(); // Store the company ID
            agence.setOwnerag(null);
            repo.save(agence);
            return temporaryCompanyId;
        }
        return null;
    }

    @Override
    public void reestablishCompagnieId(Long agenceId) {

        Agence agence = getAgenceByID(agenceId);
        if (agence != null) {
            agence.setDate_fina(null);
            agence.setStatus("Ouvert");
            saveorUpdate(agence);
        }
    }
    @Override
    public void updateDateFinToToday(Long id) {
        Agence agence = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Agence not found" + id));
        agence.setDate_fina(LocalDate.now());
        agence.setStatus("Clôture");
        repo.save(agence);
    }


}
