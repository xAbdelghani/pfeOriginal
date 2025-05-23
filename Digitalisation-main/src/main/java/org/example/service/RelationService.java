package org.example.service;

import jakarta.transaction.Transactional;
import org.example.entity.Compagnie;
import org.example.entity.Pointvente;
import org.example.repository.CompagnieRepository;
import org.example.repository.PointventeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RelationService {
    @Autowired
    private CompagnieRepository compagnieRepository;

    @Autowired
    private PointventeRepository pointventeRepository;

  /*  @Transactional
    public boolean dissocierCompagnieEtPointvente(Long compagnieId, Long pointventeId) {
        Optional<Compagnie> compagnieOpt = compagnieRepository.findById(compagnieId);
        Optional<Pointvente> pointventeOpt = pointventeRepository.findById(pointventeId);

        if (compagnieOpt.isPresent() && pointventeOpt.isPresent()) {
            Compagnie compagnie = compagnieOpt.get();
            Pointvente pointvente = pointventeOpt.get();

            if (compagnie.getPointventes().contains(pointvente)) {
                compagnie.getPointventes().remove(pointvente);
                pointvente.getCompagnies().remove(compagnie);

                compagnieRepository.save(compagnie);
                pointventeRepository.save(pointvente);

                return true;
            }
        }

        return false;
    }

    public void addCourtiersToCompany(Long compagnieId, List<Long> pointVenteIds) throws Exception {
        Compagnie compagnie = compagnieRepository.findById(compagnieId)
                .orElseThrow(() -> new Exception("Compagnie not found"));

        List<Pointvente> pointVentes = pointventeRepository.findAllById(pointVenteIds);

        if (pointVentes.size() != pointVenteIds.size()) {
            throw new Exception("One or more point ventes not found");
        }

        compagnie.getPointventes().addAll(pointVentes);
        compagnieRepository.save(compagnie);

    }*/

}
