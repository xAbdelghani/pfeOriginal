package org.example.repository;

import org.example.entity.StatutF;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface StatutFRepository extends JpaRepositoryImplementation<StatutF, Long> {
}
