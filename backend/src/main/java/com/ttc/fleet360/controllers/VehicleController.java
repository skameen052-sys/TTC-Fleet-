package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Vehicle;
import com.ttc.fleet360.services.FleetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final FleetService fleetService;

    public VehicleController(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vehicle>>> getAllVehicles(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<Vehicle> list = fleetService.getAllVehicles(status, category, search);
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = fleetService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success(vehicle));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vehicle>> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle saved = fleetService.createVehicle(vehicle);
        return ResponseEntity.ok(ApiResponse.success("Vehicle created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {
        Vehicle updated = fleetService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        fleetService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }
}
