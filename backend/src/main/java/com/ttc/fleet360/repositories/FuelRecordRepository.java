package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.FuelRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FuelRecordRepository extends JpaRepository<FuelRecord, Long> {
    List<FuelRecord> findByVehiclePlate(String vehiclePlate);

    @Query("SELECT COALESCE(SUM(f.totalCost), 0) FROM FuelRecord f")
    BigDecimal sumTotalFuelCost();
}
