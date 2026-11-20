package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.AuditLogDto;
import com.ttc.fleet360.dto.LoginHistoryDto;
import com.ttc.fleet360.services.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@Tag(name = "Audit Logs & Activity Monitoring", description = "System event tracking, login history, and security monitoring")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Search and filter system audit events")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditLogDto> logs = auditLogService.getAuditLogs(module, action, search, fromDate, toDate, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    @GetMapping("/login-history")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "View user login and session activity history")
    public ResponseEntity<ApiResponse<Page<LoginHistoryDto>>> getLoginHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<LoginHistoryDto> history = auditLogService.getLoginHistory(pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent user activity events for dashboard feed")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getRecentActivities() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.getRecentActivities()));
    }
}
