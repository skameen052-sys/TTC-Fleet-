package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.FuelRecord;
import com.fleet360.service.FuelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel")
@Tag(name = "Fuel Management", description = "Fuel Consumption, Station Logs and Expenses")
public class FuelController {

    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @GetMapping
    @Operation(summary = "Get all fuel transaction logs")
    public ResponseEntity<ApiResponse<List<FuelRecord>>> getAllFuelRecords() {
        return ResponseEntity.ok(ApiResponse.ok(fuelService.getAllFuelRecords()));
    }

    @PostMapping
    @Operation(summary = "Log new fuel purchase")
    public ResponseEntity<ApiResponse<FuelRecord>> addFuelRecord(@RequestBody FuelRecord record) {
        return ResponseEntity.ok(ApiResponse.ok("Fuel record logged successfully", fuelService.addFuelRecord(record)));
    }
}
