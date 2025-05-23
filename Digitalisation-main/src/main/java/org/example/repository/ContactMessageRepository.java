package org.example.repository;

import org.example.entity.ContactMessage;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactMessageRepository extends JpaRepositoryImplementation<ContactMessage, Long> {
}
