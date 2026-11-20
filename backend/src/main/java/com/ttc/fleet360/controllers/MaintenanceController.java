package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.MaintenanceRecord;
import com.ttc.fleet360.services.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceRecord>>> getAllMaintenance(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String vehiclePlate) {
        List<MaintenanceRecord> list = maintenanceService.getAllMaintenance(status, vehiclePlate);
        return ResponseEntity.ok(ApiResponse.success("Maintenance records retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRecord>> getMaintenanceById(@PathVariable Long id) {
        MaintenanceRecord record = maintenanceService.getMaintenanceById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRecord>> createMaintenance(@RequestBody MaintenanceRecord record) {
        MaintenanceRecord saved = maintenanceService.createMaintenance(record);
        return ResponseEntity.ok(ApiResponse.success("Service record created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRecord>> updateMaintenance(
            @PathVariable Long id,
            @RequestBody MaintenanceRecord record) {
        MaintenanceRecord updated = maintenanceService.updateMaintenance(id, record);
        return ResponseEntity.ok(ApiResponse.success("Service record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok(ApiResponse.success("Service record removed", null));
    }
}
