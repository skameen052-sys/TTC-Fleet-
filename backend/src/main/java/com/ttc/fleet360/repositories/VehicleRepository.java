package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByPlateNumber(String plateNumber);
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByAvailability(String availability);
    List<Vehicle> findByCategory(String category);

    long countByStatus(String status);
    long countByAvailability(String availability);

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.plateNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.currentCity) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> searchVehicles(String query);
}
