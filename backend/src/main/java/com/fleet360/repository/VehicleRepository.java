package com.fleet360.repository;

import com.fleet360.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByRegNumber(String regNumber);
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByCategory(String category);
    long countByStatus(String status);
}
