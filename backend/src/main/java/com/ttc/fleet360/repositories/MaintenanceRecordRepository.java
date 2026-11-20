package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByVehiclePlate(String vehiclePlate);
    List<MaintenanceRecord> findByStatus(String status);

    @Query("SELECT COALESCE(SUM(m.cost), 0) FROM MaintenanceRecord m")
    BigDecimal sumTotalMaintenanceCost();
}
