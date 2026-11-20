package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.SystemSettingDto;
import com.ttc.fleet360.entities.SystemSetting;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.SystemSettingRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;
    private final AuditLogService auditLogService;

    public SystemSettingService(SystemSettingRepository systemSettingRepository,
                                AuditLogService auditLogService) {
        this.systemSettingRepository = systemSettingRepository;
        this.auditLogService = auditLogService;
    }

    @Cacheable(value = "systemSettings", key = "'all'")
    public List<SystemSettingDto> getAllSettings() {
        return systemSettingRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Map<String, List<SystemSettingDto>> getSettingsByGroup() {
        return getAllSettings().stream().collect(Collectors.groupingBy(SystemSettingDto::getSettingGroup));
    }

    public List<SystemSettingDto> getPublicSettings() {
        return systemSettingRepository.findByIsPublicTrue().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "systemSettings", allEntries = true)
    public SystemSettingDto updateSetting(String key, String value) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found with key " + key));

        setting.setSettingValue(value);
        SystemSetting saved = systemSettingRepository.save(setting);

        auditLogService.logActivity("admin", "UPDATE", "SETTINGS", key,
                "Updated system setting " + key + " = " + value, "127.0.0.1", "SUCCESS");

        return mapToDto(saved);
    }

    @Transactional
    @CacheEvict(value = "systemSettings", allEntries = true)
    public void updateMultipleSettings(Map<String, String> settingsMap) {
        settingsMap.forEach((key, val) -> {
            systemSettingRepository.findBySettingKey(key).ifPresent(s -> {
                s.setSettingValue(val);
                systemSettingRepository.save(s);
            });
        });
        auditLogService.logActivity("admin", "UPDATE", "SETTINGS", "BATCH",
                "Updated " + settingsMap.size() + " system configurations", "127.0.0.1", "SUCCESS");
    }

    private SystemSettingDto mapToDto(SystemSetting s) {
        SystemSettingDto dto = new SystemSettingDto();
        dto.setId(s.getId());
        dto.setSettingKey(s.getSettingKey());
        dto.setSettingValue(s.getSettingValue());
        dto.setSettingGroup(s.getSettingGroup());
        dto.setDescription(s.getDescription());
        dto.setValueType(s.getValueType());
        dto.setIsPublic(s.getIsPublic());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }
}
