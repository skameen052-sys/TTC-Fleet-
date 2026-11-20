package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.MaintenanceRecord;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;

    public MaintenanceService(MaintenanceRecordRepository maintenanceRecordRepository) {
        this.maintenanceRecordRepository = maintenanceRecordRepository;
    }

    public List<MaintenanceRecord> getAllMaintenance(String status, String vehiclePlate) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return maintenanceRecordRepository.findByStatus(status.toUpperCase());
        }
        if (vehiclePlate != null && !vehiclePlate.isBlank() && !vehiclePlate.equalsIgnoreCase("ALL")) {
            return maintenanceRecordRepository.findByVehiclePlate(vehiclePlate.trim());
        }
        return maintenanceRecordRepository.findAll();
    }

    public MaintenanceRecord getMaintenanceById(Long id) {
        return maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with ID: " + id));
    }

    @Transactional
    public MaintenanceRecord createMaintenance(MaintenanceRecord record) {
        return maintenanceRecordRepository.save(record);
    }

    @Transactional
    public MaintenanceRecord updateMaintenance(Long id, MaintenanceRecord updated) {
        MaintenanceRecord existing = getMaintenanceById(id);
        existing.setVehiclePlate(updated.getVehiclePlate());
        existing.setServiceType(updated.getServiceType());
        existing.setServiceDate(updated.getServiceDate());
        existing.setCost(updated.getCost());
        existing.setOdometerReading(updated.getOdometerReading());
        existing.setServiceCenter(updated.getServiceCenter());
        existing.setStatus(updated.getStatus());
        existing.setNextServiceDueDate(updated.getNextServiceDueDate());
        existing.setNextServiceOdometer(updated.getNextServiceOdometer());
        existing.setTechnicianName(updated.getTechnicianName());
        existing.setTechnicianNotes(updated.getTechnicianNotes());
        return maintenanceRecordRepository.save(existing);
    }

    @Transactional
    public void deleteMaintenance(Long id) {
        MaintenanceRecord record = getMaintenanceById(id);
        maintenanceRecordRepository.delete(record);
    }
}
