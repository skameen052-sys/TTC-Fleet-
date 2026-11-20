package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.SystemSettingDto;
import com.ttc.fleet360.services.SystemSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Configuration & System Settings", description = "Application preferences, notifications, security limits, and telematics parameters")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @GetMapping
    @Operation(summary = "Get all system configuration parameters")
    public ResponseEntity<ApiResponse<List<SystemSettingDto>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.ok(systemSettingService.getAllSettings()));
    }

    @GetMapping("/grouped")
    @Operation(summary = "Get system settings categorized by group")
    public ResponseEntity<ApiResponse<Map<String, List<SystemSettingDto>>>> getSettingsGrouped() {
        return ResponseEntity.ok(ApiResponse.ok(systemSettingService.getSettingsByGroup()));
    }

    @GetMapping("/public")
    @Operation(summary = "Get public application configuration settings")
    public ResponseEntity<ApiResponse<List<SystemSettingDto>>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.ok(systemSettingService.getPublicSettings()));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update an individual system setting")
    public ResponseEntity<ApiResponse<SystemSettingDto>> updateSetting(
            @PathVariable String key,
            @RequestParam String value
    ) {
        SystemSettingDto updated = systemSettingService.updateSetting(key, value);
        return ResponseEntity.ok(ApiResponse.ok("Setting updated successfully", updated));
    }

    @PutMapping("/batch")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Batch update system configurations")
    public ResponseEntity<ApiResponse<String>> updateMultipleSettings(@RequestBody Map<String, String> settingsMap) {
        systemSettingService.updateMultipleSettings(settingsMap);
        return ResponseEntity.ok(ApiResponse.ok("Configurations saved successfully", null));
    }
}
