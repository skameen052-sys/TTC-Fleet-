package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.GpsLocation;
import com.ttc.fleet360.entities.Route;
import com.ttc.fleet360.services.TrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    // --- GPS Tracking Telemetry ---
    @GetMapping("/tracking/live")
    public ResponseEntity<ApiResponse<List<GpsLocation>>> getLiveTracking() {
        List<GpsLocation> list = trackingService.getAllLocations();
        return ResponseEntity.ok(ApiResponse.success("Live fleet GPS telemetry", list));
    }

    @GetMapping("/tracking/vehicle/{plateNumber}")
    public ResponseEntity<ApiResponse<GpsLocation>> getVehicleGps(@PathVariable String plateNumber) {
        GpsLocation loc = trackingService.getLocationByVehicle(plateNumber);
        return ResponseEntity.ok(ApiResponse.success(loc));
    }

    // --- Routes ---
    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        List<Route> routes = trackingService.getAllRoutes();
        return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Route>> getRouteById(@PathVariable Long id) {
        Route route = trackingService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success(route));
    }

    @PostMapping("/routes")
    public ResponseEntity<ApiResponse<Route>> createRoute(@RequestBody Route route) {
        Route saved = trackingService.createRoute(route);
        return ResponseEntity.ok(ApiResponse.success("Route created successfully", saved));
    }

    @PutMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Route>> updateRoute(
            @PathVariable Long id,
            @RequestBody Route route) {
        Route updated = trackingService.updateRoute(id, route);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", updated));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        trackingService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route removed successfully", null));
    }
}
