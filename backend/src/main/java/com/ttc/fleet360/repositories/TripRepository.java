package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Optional<Trip> findByTripNumber(String tripNumber);
    List<Trip> findByStatus(String status);
    long countByStatus(String status);

    @Query("SELECT t FROM Trip t WHERE LOWER(t.tripNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.vehiclePlate) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.driverName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Trip> searchTrips(String query);
}
