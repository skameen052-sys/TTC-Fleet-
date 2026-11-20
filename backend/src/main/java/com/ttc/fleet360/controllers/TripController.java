package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Trip;
import com.ttc.fleet360.services.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Trip>>> getAllTrips(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Trip> list = tripService.getAllTrips(status, search);
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Trip>> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Trip>> createTrip(@RequestBody Trip trip) {
        Trip saved = tripService.createTrip(trip);
        return ResponseEntity.ok(ApiResponse.success("Trip scheduled successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Trip>> updateTrip(
            @PathVariable Long id,
            @RequestBody Trip trip) {
        Trip updated = tripService.updateTrip(id, trip);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully", null));
    }
}
