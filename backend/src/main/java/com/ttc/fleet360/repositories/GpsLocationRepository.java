package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.GpsLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GpsLocationRepository extends JpaRepository<GpsLocation, Long> {
    Optional<GpsLocation> findByVehiclePlate(String vehiclePlate);
    List<GpsLocation> findByEngineStatus(String engineStatus);
}
