package com.fleet360.repository;

import com.fleet360.model.FuelRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelRepository extends JpaRepository<FuelRecord, Long> {
    List<FuelRecord> findByVehicleRegOrderByRecordDateDesc(String vehicleReg);
    List<FuelRecord> findAllByOrderByRecordDateDesc();
}
