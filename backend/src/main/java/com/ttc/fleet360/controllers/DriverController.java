package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Driver;
import com.ttc.fleet360.services.FleetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final FleetService fleetService;

    public DriverController(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Driver>>> getAllDrivers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String search) {
        List<Driver> list = fleetService.getAllDrivers(status, availability, search);
        return ResponseEntity.ok(ApiResponse.success("Drivers retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Driver>> getDriverById(@PathVariable Long id) {
        Driver driver = fleetService.getDriverById(id);
        return ResponseEntity.ok(ApiResponse.success(driver));
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<Driver>>> getExpiringDrivers(
            @RequestParam(defaultValue = "30") int days) {
        List<Driver> list = fleetService.getExpiringDrivers(days);
        return ResponseEntity.ok(ApiResponse.success("Expiring licenses retrieved", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Driver>> createDriver(@RequestBody Driver driver) {
        Driver saved = fleetService.createDriver(driver);
        return ResponseEntity.ok(ApiResponse.success("Driver created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Driver>> updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driver) {
        Driver updated = fleetService.updateDriver(id, driver);
        return ResponseEntity.ok(ApiResponse.success("Driver updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDriver(@PathVariable Long id) {
        fleetService.deleteDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver deleted successfully", null));
    }
}
