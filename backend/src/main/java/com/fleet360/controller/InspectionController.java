package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.VehicleInspection;
import com.fleet360.service.InspectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspections")
@Tag(name = "Inspections", description = "Pre/Post-Trip DOT Vehicle Inspections")
public class InspectionController {

    private final InspectionService inspectionService;

    public InspectionController(InspectionService inspectionService) {
        this.inspectionService = inspectionService;
    }

    @GetMapping
    @Operation(summary = "Get all vehicle safety inspection records")
    public ResponseEntity<ApiResponse<List<VehicleInspection>>> getAllInspections() {
        return ResponseEntity.ok(ApiResponse.ok(inspectionService.getAllInspections()));
    }

    @PostMapping
    @Operation(summary = "Record certified vehicle inspection")
    public ResponseEntity<ApiResponse<VehicleInspection>> recordInspection(@RequestBody VehicleInspection inspection) {
        return ResponseEntity.ok(ApiResponse.ok("Inspection recorded successfully", inspectionService.recordInspection(inspection)));
    }
}
