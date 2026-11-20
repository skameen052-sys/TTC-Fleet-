package com.fleet360.service;

import com.fleet360.model.Vehicle;
import com.fleet360.repository.VehicleRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleByReg(String regNumber) {
        return vehicleRepository.findByRegNumber(regNumber);
    }

    public List<Vehicle> getVehiclesByStatus(String status) {
        return vehicleRepository.findByStatus(status);
    }

    public List<Vehicle> getVehiclesByCategory(String category) {
        return vehicleRepository.findByCategory(category);
    }

    @CacheEvict(value = {"dashboard_summary", "vehicle_status_overview"}, allEntries = true)
    public Vehicle saveVehicle(@NonNull Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @CacheEvict(value = {"dashboard_summary", "vehicle_status_overview"}, allEntries = true)
    public void deleteVehicle(@NonNull Long id) {
        vehicleRepository.deleteById(id);
    }
}
