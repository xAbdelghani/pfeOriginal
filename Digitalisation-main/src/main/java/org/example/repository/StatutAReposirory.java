package org.example.repository;

import org.example.entity.StatutA;

import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface StatutAReposirory extends JpaRepositoryImplementation<StatutA, Long> {
}
