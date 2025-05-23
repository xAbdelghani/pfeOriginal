package org.example.repository;


import org.example.entity.Compagnie;
import org.example.entity.Pointvente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointventeRepository extends JpaRepositoryImplementation<Pointvente, Long> {
    /*@Query("SELECT p FROM Pointvente p WHERE p.id NOT IN (SELECT pv.id FROM Compagnie c JOIN c.pointventes pv WHERE c.id = :compagnieId)")
    List<Pointvente> findUnrelatedPointventes(@Param("compagnieId") Long compagnieId);*/

}
