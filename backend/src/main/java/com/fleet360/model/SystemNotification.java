package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_notifications")
public class SystemNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String notificationId;

    private String recipientRole; // ALL, ROLE_CUSTOMER, ROLE_LOGISTICS_MANAGER, ROLE_FLEET_MANAGER, ROLE_DRIVER, ROLE_WAREHOUSE_MANAGER, ROLE_FINANCE_MANAGER, ROLE_ADMIN
    private String recipientId;
    private String title;

    @Column(length = 1000)
    private String message;

    private String type; // info, success, warning, alert
    private boolean isRead = false;
    private String linkPortal;
    private String linkTab;

    private LocalDateTime createdAt = LocalDateTime.now();

    public SystemNotification() {}

    public SystemNotification(String notificationId, String recipientRole, String recipientId,
                              String title, String message, String type, String linkPortal, String linkTab) {
        this.notificationId = notificationId;
        this.recipientRole = recipientRole;
        this.recipientId = recipientId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.linkPortal = linkPortal;
        this.linkTab = linkTab;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNotificationId() { return notificationId; }
    public void setNotificationId(String notificationId) { this.notificationId = notificationId; }
    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public String getLinkPortal() { return linkPortal; }
    public void setLinkPortal(String linkPortal) { this.linkPortal = linkPortal; }
    public String getLinkTab() { return linkTab; }
    public void setLinkTab(String linkTab) { this.linkTab = linkTab; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
