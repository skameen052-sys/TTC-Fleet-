package com.fleet360.repository;

import com.fleet360.model.VehicleInspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<VehicleInspection, Long> {
    List<VehicleInspection> findByVehicleReg(String vehicleReg);
    List<VehicleInspection> findByOverallStatus(String overallStatus);
}
