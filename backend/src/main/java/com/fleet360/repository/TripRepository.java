package com.fleet360.repository;

import com.fleet360.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Optional<Trip> findByTripId(String tripId);
    Optional<Trip> findByOrderId(String orderId);
    Optional<Trip> findByShipmentId(String shipmentId);
    List<Trip> findByDriverId(String driverId);
    List<Trip> findByVehicleReg(String vehicleReg);
}
