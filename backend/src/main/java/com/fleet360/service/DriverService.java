package com.fleet360.service;

import com.fleet360.model.Driver;
import com.fleet360.repository.DriverRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {
    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByStatus("Available");
    }

    public Optional<Driver> getDriverByCode(String code) {
        return driverRepository.findByCode(code);
    }

    @CacheEvict(value = "dashboard_summary", allEntries = true)
    public Driver saveDriver(@NonNull Driver driver) {
        return driverRepository.save(driver);
    }
}
