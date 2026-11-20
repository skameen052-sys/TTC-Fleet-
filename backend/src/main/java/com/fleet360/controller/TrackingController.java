package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.LiveGpsLocation;
import com.fleet360.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@Tag(name = "GPS Tracking", description = "Live Telemetry and Vehicle GPS Positions")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/live")
    @Operation(summary = "Get current GPS telemetry for all active fleet assets")
    public ResponseEntity<ApiResponse<List<LiveGpsLocation>>> getLiveTracking() {
        return ResponseEntity.ok(ApiResponse.ok(trackingService.getAllLiveLocations()));
    }

    @PostMapping("/telemetry")
    @Operation(summary = "Receive telemetry update ping from in-vehicle GPS unit")
    public ResponseEntity<ApiResponse<LiveGpsLocation>> postTelemetry(@RequestBody LiveGpsLocation location) {
        return ResponseEntity.ok(ApiResponse.ok(trackingService.updateLocation(location)));
    }
}
