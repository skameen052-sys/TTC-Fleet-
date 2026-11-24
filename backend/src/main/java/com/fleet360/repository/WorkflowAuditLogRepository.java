package com.fleet360.repository;

import com.fleet360.model.WorkflowAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowAuditLogRepository extends JpaRepository<WorkflowAuditLog, Long> {
    List<WorkflowAuditLog> findTop50ByOrderByRecordedAtDesc();
    List<WorkflowAuditLog> findByEntityTypeAndEntityIdOrderByRecordedAtDesc(String entityType, String entityId);
}
