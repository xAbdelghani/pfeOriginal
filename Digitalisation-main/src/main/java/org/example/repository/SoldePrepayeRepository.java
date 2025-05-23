package org.example.repository;


import org.example.entity.SoldePrepaye;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoldePrepayeRepository extends JpaRepositoryImplementation<SoldePrepaye, Long> {
    List<SoldePrepaye> findByOwnersoId(Long compagnieId);
}
