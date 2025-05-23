package org.example.service.impl;

import org.example.entity.Notification;
import org.example.repository.NotificationRepository;
import org.example.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    @Override
    public Notification createNotification(String messagen, String description) {
        Notification notification = new Notification();
        notification.setMessagen(messagen);
        notification.setDescription(description);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());

        return notificationRepository.save(notification);
    }
    @Override
    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByReadFalse();
    }
    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    @Override
    public List<Notification> getNotificationsByCompanyId(Long companyId) {
        return notificationRepository.findByCompagniesId(companyId);
    }

}
