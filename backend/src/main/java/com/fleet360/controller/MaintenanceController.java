package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.MaintenanceRecord;
import com.fleet360.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@Tag(name = "Maintenance", description = "Vehicle Maintenance, PM Schedules and Work Orders")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    @Operation(summary = "Get all maintenance work orders")
    public ResponseEntity<ApiResponse<List<MaintenanceRecord>>> getAllRecords() {
        return ResponseEntity.ok(ApiResponse.ok(maintenanceService.getAllMaintenanceRecords()));
    }

    @PostMapping
    @Operation(summary = "Schedule new maintenance work order")
    public ResponseEntity<ApiResponse<MaintenanceRecord>> scheduleMaintenance(@RequestBody MaintenanceRecord record) {
        return ResponseEntity.ok(ApiResponse.ok("Work order booked successfully", maintenanceService.scheduleMaintenance(record)));
    }
}
