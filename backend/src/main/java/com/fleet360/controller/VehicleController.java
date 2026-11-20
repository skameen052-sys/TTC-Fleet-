package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.Vehicle;
import com.fleet360.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicles", description = "Vehicle Asset Inventory Management")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "List all registered fleet vehicles")
    public ResponseEntity<ApiResponse<List<Vehicle>>> getAllVehicles() {
        return ResponseEntity.ok(ApiResponse.ok(vehicleService.getAllVehicles()));
    }

    @GetMapping("/{regNumber}")
    @Operation(summary = "Get vehicle by registration number")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicle(@PathVariable String regNumber) {
        return vehicleService.getVehicleByReg(regNumber)
                .map(v -> ResponseEntity.ok(ApiResponse.ok(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Register new vehicle asset")
    public ResponseEntity<ApiResponse<Vehicle>> addVehicle(@RequestBody Vehicle vehicle) {
        Vehicle saved = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle registered successfully", saved));
    }
}
