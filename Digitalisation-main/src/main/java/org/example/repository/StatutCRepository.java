package org.example.repository;


import org.example.entity.StatutC;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface StatutCRepository extends JpaRepositoryImplementation<StatutC, Long> {
}
