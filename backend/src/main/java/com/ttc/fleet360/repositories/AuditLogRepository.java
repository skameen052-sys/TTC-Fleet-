package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:module IS NULL OR a.module = :module) " +
           "AND (:action IS NULL OR a.action = :action) " +
           "AND (:search IS NULL OR LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:fromDate IS NULL OR a.createdAt >= :fromDate) " +
           "AND (:toDate IS NULL OR a.createdAt <= :toDate)")
    Page<AuditLog> filterAuditLogs(
        @Param("module") String module,
        @Param("action") String action,
        @Param("search") String search,
        @Param("fromDate") Instant fromDate,
        @Param("toDate") Instant toDate,
        Pageable pageable
    );

    List<AuditLog> findTop5ByOrderByCreatedAtDesc();
}
