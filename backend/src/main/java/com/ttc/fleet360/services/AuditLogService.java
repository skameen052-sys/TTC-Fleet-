package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.AuditLogDto;
import com.ttc.fleet360.dto.LoginHistoryDto;
import com.ttc.fleet360.entities.AuditLog;
import com.ttc.fleet360.entities.LoginHistory;
import com.ttc.fleet360.repositories.AuditLogRepository;
import com.ttc.fleet360.repositories.LoginHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    public AuditLogService(AuditLogRepository auditLogRepository,
                           LoginHistoryRepository loginHistoryRepository) {
        this.auditLogRepository = auditLogRepository;
        this.loginHistoryRepository = loginHistoryRepository;
    }

    public void logActivity(String userEmail, String action, String module, String entityId, String details, String ipAddress, String status) {
        try {
            AuditLog log = new AuditLog(userEmail, action, module, entityId, details, ipAddress, status != null ? status : "SUCCESS");
            auditLogRepository.save(log);
        } catch (Exception ignored) {
            // Logging shouldn't interrupt transaction flow
        }
    }

    public Page<AuditLogDto> getAuditLogs(String module, String action, String search, Instant fromDate, Instant toDate, Pageable pageable) {
        return auditLogRepository.filterAuditLogs(module, action, search, fromDate, toDate, pageable).map(this::mapToAuditDto);
    }

    public Page<LoginHistoryDto> getLoginHistory(Pageable pageable) {
        return loginHistoryRepository.findAllByOrderByTimestampDesc(pageable).map(this::mapToLoginDto);
    }

    public List<AuditLogDto> getRecentActivities() {
        return auditLogRepository.findTop5ByOrderByCreatedAtDesc().stream().map(this::mapToAuditDto).collect(Collectors.toList());
    }

    private AuditLogDto mapToAuditDto(AuditLog a) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(a.getId());
        dto.setUserId(a.getUserId());
        dto.setUserEmail(a.getUserEmail());
        dto.setAction(a.getAction());
        dto.setModule(a.getModule());
        dto.setEntityId(a.getEntityId());
        dto.setDetails(a.getDetails());
        dto.setIpAddress(a.getIpAddress());
        dto.setUserAgent(a.getUserAgent());
        dto.setStatus(a.getStatus());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }

    private LoginHistoryDto mapToLoginDto(LoginHistory l) {
        LoginHistoryDto dto = new LoginHistoryDto();
        dto.setId(l.getId());
        dto.setUserId(l.getUserId());
        dto.setEmail(l.getEmail());
        dto.setStatus(l.getStatus());
        dto.setIpAddress(l.getIpAddress());
        dto.setUserAgent(l.getUserAgent());
        dto.setLocation(l.getLocation());
        dto.setFailureReason(l.getFailureReason());
        dto.setTimestamp(l.getTimestamp());
        return dto;
    }
}
