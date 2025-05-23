package org.example.repository;


import org.example.entity.Role;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepositoryImplementation<Role, Long> {
    Role findByTypee(String typee);
}
