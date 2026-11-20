package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_email", length = 120)
    private String recipientEmail = "all";

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType = "SYSTEM"; // SYSTEM, VEHICLE_ALERT, MAINTENANCE_REMINDER, DRIVER_EXPIRY, SHIPMENT_UPDATE

    @Column(nullable = false, length = 30)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "action_url", length = 200)
    private String actionUrl;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public Notification() {}

    public Notification(String title, String message, String notificationType, String priority, String actionUrl) {
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.priority = priority;
        this.actionUrl = actionUrl;
        this.isRead = false;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
