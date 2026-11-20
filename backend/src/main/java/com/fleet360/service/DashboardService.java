package com.fleet360.service;

import com.fleet360.dto.DashboardSummaryDto;
import com.fleet360.dto.VehicleStatusOverviewDto;
import com.fleet360.repository.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public DashboardService(VehicleRepository vehicleRepository,
                            DriverRepository driverRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Cacheable(value = "dashboard_summary", unless = "#result == null")
    public DashboardSummaryDto getSummaryMetrics() {
        long totalVehicles = vehicleRepository.count();
        long availableVehicles = vehicleRepository.countByStatus("Available");
        long vehiclesOnTrip = vehicleRepository.countByStatus("On Trip");
        long vehiclesUnderMaintenance = vehicleRepository.countByStatus("Under Maintenance");
        long inactiveVehicles = vehicleRepository.countByStatus("Out of Service");
        long activeVehicles = availableVehicles + vehiclesOnTrip;

        long totalDrivers = driverRepository.count();
        long availableDrivers = driverRepository.countByStatus("Available");

        return new DashboardSummaryDto(
                totalVehicles,
                activeVehicles,
                availableVehicles,
                vehiclesOnTrip,
                vehiclesUnderMaintenance,
                inactiveVehicles,
                totalDrivers,
                availableDrivers
        );
    }

    @Cacheable(value = "vehicle_status_overview", unless = "#result == null")
    public VehicleStatusOverviewDto getVehicleStatusOverview() {
        long total = vehicleRepository.count();
        if (total == 0) total = 1;

        long available = vehicleRepository.countByStatus("Available");
        long onTrip = vehicleRepository.countByStatus("On Trip");
        long waiting = vehicleRepository.countByStatus("Waiting for Assignment");
        long maintenance = vehicleRepository.countByStatus("Under Maintenance");
        long outOfService = vehicleRepository.countByStatus("Out of Service");

        VehicleStatusOverviewDto dto = new VehicleStatusOverviewDto();
        dto.setTotal(total);
        dto.setAvailable(new VehicleStatusOverviewDto.StatusCount(available, (int) Math.round((double) available / total * 100)));
        dto.setOnTrip(new VehicleStatusOverviewDto.StatusCount(onTrip, (int) Math.round((double) onTrip / total * 100)));
        dto.setWaiting(new VehicleStatusOverviewDto.StatusCount(waiting, (int) Math.round((double) waiting / total * 100)));
        dto.setMaintenance(new VehicleStatusOverviewDto.StatusCount(maintenance, (int) Math.round((double) maintenance / total * 100)));
        dto.setOutOfService(new VehicleStatusOverviewDto.StatusCount(outOfService, (int) Math.round((double) outOfService / total * 100)));

        return dto;
    }

    public Map<String, Object> getUtilizationAnalytics() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalUtilizationPercent", 78.5);
        response.put("idlePercent", 12.5);
        response.put("maintenancePercent", 9.0);
        return response;
    }
}
