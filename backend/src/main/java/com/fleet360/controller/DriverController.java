package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.Driver;
import com.fleet360.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@Tag(name = "Drivers", description = "Commercial CDL Driver Management")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    @Operation(summary = "Get all commercial drivers")
    public ResponseEntity<ApiResponse<List<Driver>>> getAllDrivers() {
        return ResponseEntity.ok(ApiResponse.ok(driverService.getAllDrivers()));
    }

    @GetMapping("/available")
    @Operation(summary = "Get drivers available for dispatch")
    public ResponseEntity<ApiResponse<List<Driver>>> getAvailableDrivers() {
        return ResponseEntity.ok(ApiResponse.ok(driverService.getAvailableDrivers()));
    }
}
