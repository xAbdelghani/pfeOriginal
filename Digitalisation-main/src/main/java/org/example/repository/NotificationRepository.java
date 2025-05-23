package org.example.repository;

import org.example.entity.Notification;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepositoryImplementation<Notification, Long> {
    List<Notification> findByReadFalse();

    //List<Notification> findByCompanyId(Long companyId);
List<Notification> findByCompagniesId(Long companyId);

}
