package org.example.Dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Notification;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDto {
    private Long id;

    private String messagen;

    private String description;

    private boolean read;

    private LocalDateTime timestamp;

    private Long companyId;


    public static NotificationDto toDto(Notification notification){
        return NotificationDto.builder()
                .id(notification.getId())
                .messagen(notification.getMessagen())
                .description(notification.getDescription())
                .read(notification.isRead())
                .timestamp(notification.getTimestamp())

                .build();
    }
}
