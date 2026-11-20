package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.FuelRecord;
import com.ttc.fleet360.services.FuelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel")
public class FuelController {

    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FuelRecord>>> getAllFuelRecords(
            @RequestParam(required = false) String vehiclePlate) {
        List<FuelRecord> list = fuelService.getAllFuelRecords(vehiclePlate);
        return ResponseEntity.ok(ApiResponse.success("Fuel logs retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelRecord>> getFuelRecordById(@PathVariable Long id) {
        FuelRecord record = fuelService.getFuelRecordById(id);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FuelRecord>> createFuelRecord(@RequestBody FuelRecord record) {
        FuelRecord saved = fuelService.createFuelRecord(record);
        return ResponseEntity.ok(ApiResponse.success("Fuel record logged successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelRecord>> updateFuelRecord(
            @PathVariable Long id,
            @RequestBody FuelRecord record) {
        FuelRecord updated = fuelService.updateFuelRecord(id, record);
        return ResponseEntity.ok(ApiResponse.success("Fuel record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFuelRecord(@PathVariable Long id) {
        fuelService.deleteFuelRecord(id);
        return ResponseEntity.ok(ApiResponse.success("Fuel record deleted successfully", null));
    }
}
