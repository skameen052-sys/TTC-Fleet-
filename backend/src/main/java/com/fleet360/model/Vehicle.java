package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String regNumber;

    @Column(nullable = false, unique = true)
    private String vin;

    private String make;
    private String model;
    private Integer modelYear;
    private String category; // Heavy Duty Truck, Electric Cargo, Refrigerated Truck, Delivery Cargo Van, Utility Van
    private String status;   // Available, On Trip, Waiting for Assignment, Under Maintenance, Out of Service
    private String fuelType; // Diesel, Electric, Gasoline, Hybrid
    private Integer mileage; // Odometer km
    private Integer maxPayloadKg;
    private Integer batteryHealth; // %
    private String currentLocation;
    private String assignedDriverId;
    private String assignedDriverName;
    private String efficiency;
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Vehicle() {}

    public Vehicle(String regNumber, String vin, String make, String model, Integer modelYear,
                   String category, String status, String fuelType, Integer mileage,
                   Integer maxPayloadKg, Integer batteryHealth, String currentLocation,
                   String assignedDriverId, String assignedDriverName, String efficiency) {
        this.regNumber = regNumber;
        this.vin = vin;
        this.make = make;
        this.model = model;
        this.modelYear = modelYear;
        this.category = category;
        this.status = status;
        this.fuelType = fuelType;
        this.mileage = mileage;
        this.maxPayloadKg = maxPayloadKg;
        this.batteryHealth = batteryHealth;
        this.currentLocation = currentLocation;
        this.assignedDriverId = assignedDriverId;
        this.assignedDriverName = assignedDriverName;
        this.efficiency = efficiency;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public Integer getModelYear() { return modelYear; }
    public void setModelYear(Integer modelYear) { this.modelYear = modelYear; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    public Integer getMaxPayloadKg() { return maxPayloadKg; }
    public void setMaxPayloadKg(Integer maxPayloadKg) { this.maxPayloadKg = maxPayloadKg; }
    public Integer getBatteryHealth() { return batteryHealth; }
    public void setBatteryHealth(Integer batteryHealth) { this.batteryHealth = batteryHealth; }
    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public String getAssignedDriverName() { return assignedDriverName; }
    public void setAssignedDriverName(String assignedDriverName) { this.assignedDriverName = assignedDriverName; }
    public String getEfficiency() { return efficiency; }
    public void setEfficiency(String efficiency) { this.efficiency = efficiency; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
