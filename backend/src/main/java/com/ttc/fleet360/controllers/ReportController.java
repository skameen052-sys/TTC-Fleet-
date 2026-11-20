package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.services.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/comprehensive")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getComprehensiveReport() {
        Map<String, Object> data = reportService.getComprehensiveReport();
        return ResponseEntity.ok(ApiResponse.success("Analytics report compiled", data));
    }
}
