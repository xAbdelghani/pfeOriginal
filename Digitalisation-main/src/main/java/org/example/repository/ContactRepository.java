package org.example.repository;

import org.example.entity.Contact;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository  extends JpaRepositoryImplementation<Contact, Long> {
    List<Contact> findByOwnercoId(Long compagnieId);
}
