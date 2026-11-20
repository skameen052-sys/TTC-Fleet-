package com.fleet360.repository;

import com.fleet360.model.LiveGpsLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GpsTrackingRepository extends JpaRepository<LiveGpsLocation, Long> {
    Optional<LiveGpsLocation> findByVehicleReg(String vehicleReg);
    List<LiveGpsLocation> findByStatus(String status);
}
