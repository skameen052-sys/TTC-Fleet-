package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.dto.DashboardSummaryDto;
import com.fleet360.dto.VehicleStatusOverviewDto;
import com.fleet360.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Fleet Manager Dashboard Analytics & Metrics")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary-cards")
    @Operation(summary = "Get 8 Summary Metrics for the top dashboard row")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummaryCards() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSummaryMetrics()));
    }

    @GetMapping("/vehicle-status")
    @Operation(summary = "Get Vehicle Status Overview counts & percentages")
    public ResponseEntity<ApiResponse<VehicleStatusOverviewDto>> getVehicleStatus() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getVehicleStatusOverview()));
    }

    @GetMapping("/utilization")
    @Operation(summary = "Get Fleet Utilization rate & analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUtilization() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getUtilizationAnalytics()));
    }
}
