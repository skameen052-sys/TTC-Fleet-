package com.fleet360.repository;

import com.fleet360.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByCode(String code);
    List<Driver> findByStatus(String status);
    long countByStatus(String status);
}
