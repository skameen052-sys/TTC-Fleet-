package com.fleet360.repository;

import com.fleet360.model.VehicleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<VehicleAssignment, Long> {
    List<VehicleAssignment> findByStatus(String status);
    List<VehicleAssignment> findByVehicleReg(String vehicleReg);
    List<VehicleAssignment> findByDriverId(String driverId);
}
