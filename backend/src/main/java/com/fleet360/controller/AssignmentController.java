package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.model.VehicleAssignment;
import com.fleet360.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@Tag(name = "Assignments", description = "Vehicle & Driver Route Dispatching")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    @Operation(summary = "Get all vehicle assignment records")
    public ResponseEntity<ApiResponse<List<VehicleAssignment>>> getAllAssignments() {
        return ResponseEntity.ok(ApiResponse.ok(assignmentService.getAllAssignments()));
    }

    @PostMapping
    @Operation(summary = "Assign vehicle to driver with designated route")
    public ResponseEntity<ApiResponse<VehicleAssignment>> assignVehicle(@RequestBody Map<String, String> payload) {
        String vehicleReg = payload.get("vehicleReg");
        String driverId = payload.get("driverId");
        String routeName = payload.get("routeName");
        String expectedReturn = payload.get("expectedReturn");

        VehicleAssignment assignment = assignmentService.assignVehicle(vehicleReg, driverId, routeName, expectedReturn);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle successfully assigned and dispatched", assignment));
    }
}
