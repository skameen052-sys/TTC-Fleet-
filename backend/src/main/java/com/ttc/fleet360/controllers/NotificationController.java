package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Notification;
import com.ttc.fleet360.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAllNotifications() {
        List<Notification> list = notificationService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", list));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications() {
        List<Notification> list = notificationService.getUnreadNotifications();
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        long count = notificationService.getUnreadCount();
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(@RequestBody Notification notification) {
        Notification saved = notificationService.createNotification(notification);
        return ResponseEntity.ok(ApiResponse.success("Notification created", saved));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long id) {
        Notification updated = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", updated));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success("All marked as read", null));
    }
}
