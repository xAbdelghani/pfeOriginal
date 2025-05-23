package org.example.controller;

import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.NotificationDto;
import org.example.entity.Notification;
import org.example.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/notification")
@SecurityRequirement(name = "Keycloak")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping ("/save")
    public NotificationDto createNotification(@RequestBody NotificationDto notificationDto) {
        Notification notification = notificationService.createNotification(notificationDto.getMessagen(), notificationDto.getDescription());
        return NotificationDto.toDto(notification);
    }

    @GetMapping(value = "/getall")
    public List<NotificationDto> getUnreadNotifications() {
        List<Notification> notifications = notificationService.getUnreadNotifications();
        return notifications.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @GetMapping("/compagnie/{companyId}")
    public List<NotificationDto> getNotificationsByCompanyId(@PathVariable Long companyId) {
        List<Notification> notifications = notificationService.getNotificationsByCompanyId(companyId);
        return notifications.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }


}
