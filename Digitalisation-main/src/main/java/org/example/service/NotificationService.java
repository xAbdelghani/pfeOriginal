package org.example.service;

import org.example.entity.Notification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationService {
     Notification createNotification(String messagen, String description);
    List<Notification> getUnreadNotifications();
     void markAsRead(Long id);
    List<Notification> getNotificationsByCompanyId(Long companyId);
}
