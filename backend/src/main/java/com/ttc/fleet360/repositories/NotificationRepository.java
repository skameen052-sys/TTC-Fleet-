package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
    List<Notification> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();
}
