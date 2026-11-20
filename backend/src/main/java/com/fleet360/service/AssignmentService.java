package com.fleet360.service;

import com.fleet360.model.Driver;
import com.fleet360.model.Vehicle;
import com.fleet360.model.VehicleAssignment;
import com.fleet360.repository.AssignmentRepository;
import com.fleet360.repository.DriverRepository;
import com.fleet360.repository.VehicleRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             VehicleRepository vehicleRepository,
                             DriverRepository driverRepository) {
        this.assignmentRepository = assignmentRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<VehicleAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = {"dashboard_summary", "vehicle_status_overview"}, allEntries = true)
    public VehicleAssignment assignVehicle(@NonNull String vehicleReg, @NonNull String driverId, String routeName, String expectedReturn) {
        Vehicle vehicle = vehicleRepository.findByRegNumber(vehicleReg)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vehicleReg));
        Driver driver = driverRepository.findByCode(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found: " + driverId));

        vehicle.setStatus("On Trip");
        vehicle.setAssignedDriverId(driver.getCode());
        vehicle.setAssignedDriverName(driver.getFullName());
        vehicleRepository.save(Objects.requireNonNull(vehicle));

        driver.setStatus("On Duty");
        driver.setAssignedVehicleReg(vehicle.getRegNumber());
        driverRepository.save(Objects.requireNonNull(driver));

        VehicleAssignment assignment = new VehicleAssignment(
                vehicle.getRegNumber(),
                driver.getCode(),
                driver.getFullName(),
                routeName,
                java.time.LocalDateTime.now().toString().substring(0, 16),
                "Active",
                expectedReturn
        );

        return assignmentRepository.save(Objects.requireNonNull(assignment));
    }
}
