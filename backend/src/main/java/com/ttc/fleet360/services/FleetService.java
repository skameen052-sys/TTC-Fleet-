package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Driver;
import com.ttc.fleet360.entities.Vehicle;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.DriverRepository;
import com.ttc.fleet360.repositories.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FleetService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public FleetService(VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    // --- Vehicle Operations ---
    public List<Vehicle> getAllVehicles(String status, String category, String search) {
        if (search != null && !search.isBlank()) {
            return vehicleRepository.searchVehicles(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return vehicleRepository.findByStatus(status.toUpperCase());
        }
        if (category != null && !category.equalsIgnoreCase("ALL")) {
            return vehicleRepository.findByCategory(category.toUpperCase());
        }
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle existing = getVehicleById(id);
        existing.setPlateNumber(updated.getPlateNumber());
        existing.setVin(updated.getVin());
        existing.setMake(updated.getMake());
        existing.setModel(updated.getModel());
        existing.setManufacturingYear(updated.getManufacturingYear());
        existing.setCategory(updated.getCategory());
        existing.setStatus(updated.getStatus());
        existing.setAvailability(updated.getAvailability());
        existing.setPayloadCapacityKg(updated.getPayloadCapacityKg());
        existing.setFuelType(updated.getFuelType());
        existing.setOdometerKm(updated.getOdometerKm());
        existing.setCurrentCity(updated.getCurrentCity());
        existing.setBranchId(updated.getBranchId());
        existing.setAssignedDriverId(updated.getAssignedDriverId());
        existing.setAssignedDriverName(updated.getAssignedDriverName());
        return vehicleRepository.save(existing);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    // --- Driver Operations ---
    public List<Driver> getAllDrivers(String status, String availability, String search) {
        if (search != null && !search.isBlank()) {
            return driverRepository.searchDrivers(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return driverRepository.findByStatus(status.toUpperCase());
        }
        if (availability != null && !availability.equalsIgnoreCase("ALL")) {
            return driverRepository.findByAvailability(availability.toUpperCase());
        }
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));
    }

    @Transactional
    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    @Transactional
    public Driver updateDriver(Long id, Driver updated) {
        Driver existing = getDriverById(id);
        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setLicenseNumber(updated.getLicenseNumber());
        existing.setLicenseCategory(updated.getLicenseCategory());
        existing.setLicenseExpiryDate(updated.getLicenseExpiryDate());
        existing.setMedicalCertExpiry(updated.getMedicalCertExpiry());
        existing.setStatus(updated.getStatus());
        existing.setAvailability(updated.getAvailability());
        existing.setExperienceYears(updated.getExperienceYears());
        existing.setRating(updated.getRating());
        existing.setEmergencyContact(updated.getEmergencyContact());
        existing.setAssignedVehiclePlate(updated.getAssignedVehiclePlate());
        existing.setBranchId(updated.getBranchId());
        return driverRepository.save(existing);
    }

    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    public List<Driver> getExpiringDrivers(int daysAhead) {
        LocalDate threshold = LocalDate.now().plusDays(daysAhead);
        return driverRepository.findByLicenseExpiryDateBefore(threshold);
    }
}
