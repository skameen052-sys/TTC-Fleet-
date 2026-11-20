package com.fleet360.repository;

import com.fleet360.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByStatus(String status);
    List<MaintenanceRecord> findByVehicleReg(String vehicleReg);
    long countByStatus(String status);
}
