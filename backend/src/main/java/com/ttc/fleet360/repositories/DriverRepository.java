package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByDriverCode(String driverCode);
    List<Driver> findByStatus(String status);
    List<Driver> findByAvailability(String availability);

    long countByStatus(String status);
    long countByAvailability(String availability);

    List<Driver> findByLicenseExpiryDateBefore(LocalDate date);

    @Query("SELECT d FROM Driver d WHERE LOWER(d.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.driverCode) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Driver> searchDrivers(String query);
}
