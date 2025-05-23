package org.example.repository;

import org.example.entity.Compagnie;
import org.example.entity.Contact;
import org.example.entity.Pointvente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompagnieRepository extends JpaRepositoryImplementation<Compagnie, Long> {
   // List<Compagnie> findByPointventesContaining(Pointvente pointvente);
   List<Compagnie> findByIdNotIn(List<Long> ids);
   List<Compagnie> findByNomIsNotNull();
   List<Compagnie> findByNomIsNull();

   Optional<Compagnie> findCompagniesByRaisonSocial(String raisonSocial);
   Optional<Compagnie> findByEmail(String email);

   @Query("SELECT c.id FROM Compagnie c WHERE c.email = :email")
   Long findIdByEmail(@Param("email") String email);
}
