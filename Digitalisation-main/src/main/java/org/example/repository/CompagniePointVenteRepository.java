package org.example.repository;

import org.example.entity.Compagnie;
import org.example.entity.Contact;
import org.example.entity.Pointvente;
import org.example.entity.RelationPointventeCompagnie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompagniePointVenteRepository extends JpaRepositoryImplementation<RelationPointventeCompagnie, Long> {
    //RelationPointventeCompagnie findByCompagnieAndPointvente(Compagnie compagnie, Pointvente pointvente);
    List<RelationPointventeCompagnie> findByCompagnieAndPointvente(Compagnie compagnie, Pointvente pointvente);
    List<RelationPointventeCompagnie> findByCompagnieAndPointventeAndActiveTrue(Compagnie compagnie, Pointvente pointvente);
    @Query("SELECT r.compagnie.id FROM RelationPointventeCompagnie r WHERE r.pointvente.id = :pointventeId")
    List<Long> findCompagnieIdsByPointventeId(@Param("pointventeId") Long pointventeId);



    List<RelationPointventeCompagnie> findByCompagnieIdAndPointventeId(Long compagnieId, Long pointventeId);

   // List<RelationPointventeCompagnie> findByActiveFalse();
   List<RelationPointventeCompagnie> findByActiveFalseAndPointventeId(Long pointventeId);
    List<RelationPointventeCompagnie> findByActiveTrueAndPointventeId(Long pointventeId);
   // List<RelationPointventeCompagnie> findByActiveTrue();

    List<RelationPointventeCompagnie> findByPointventeId(Long pointventeId);

}
