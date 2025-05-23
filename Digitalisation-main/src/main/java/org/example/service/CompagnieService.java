package org.example.service;

import org.example.Dto.CompagnieDto;
import org.example.entity.Compagnie;
import org.example.entity.Contact;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public interface CompagnieService {
    void saveorUpdate(Compagnie compagnies);
    //void Update(Compagnie compagnies);

    //void updateCompagnie(Long id, Long pointventeId);
    List<Compagnie> listAll();
    void deleteCompagnie(Long id);
    Compagnie getCompagnieByID(Long compagnieid);

    void Update(Compagnie compagnies);



    CompagnieDto updateCompagniee(Long compagnieId, CompagnieDto updatedCompagnieDto);

    void updateCompagnie(Long compagnieId, Long pointventeId, LocalDate dateDebut, LocalDate dateFin);

    void updateLoginAndGeneratePassword(Long compagnieId, String newLogin);
    List<CompagnieDto> getCompagniesWithNonNullNom();
    List<CompagnieDto> getCompagniesWithNullNom();
    void transferLoginAndPasswordToNull(Long compagnieId);

    Optional<Compagnie> findCompagnieByEmail(String email);

    Long findCompagnieIdByEmail(String email);
}
