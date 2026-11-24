package com.fleet360.repository;

import com.fleet360.model.SystemNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemNotificationRepository extends JpaRepository<SystemNotification, Long> {
    List<SystemNotification> findByRecipientRoleOrderByCreatedAtDesc(String recipientRole);
    List<SystemNotification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
}
