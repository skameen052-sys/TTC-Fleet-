package com.fleet360.service;

import com.fleet360.model.MaintenanceRecord;
import com.fleet360.repository.MaintenanceRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }

    public List<MaintenanceRecord> getRecordsByStatus(String status) {
        return maintenanceRepository.findByStatus(status);
    }

    @CacheEvict(value = {"dashboard_summary", "vehicle_status_overview"}, allEntries = true)
    public MaintenanceRecord scheduleMaintenance(@NonNull MaintenanceRecord record) {
        return maintenanceRepository.save(record);
    }
}
