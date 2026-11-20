package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate_number", nullable = false, unique = true, length = 30)
    private String plateNumber;

    @Column(length = 50)
    private String vin;

    @Column(nullable = false, length = 50)
    private String make;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(name = "manufacturing_year")
    private Integer manufacturingYear = 2023;

    @Column(nullable = false, length = 40)
    private String category = "HEAVY_TRUCK"; // HEAVY_TRUCK, CONTAINER_CARRIER, TANKER, MEDIUM_HAULER, LIGHT_DELIVERY, TRAILER

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DECOMMISSIONED

    @Column(nullable = false, length = 30)
    private String availability = "AVAILABLE"; // AVAILABLE, ON_TRIP, IN_MAINTENANCE, RESERVED

    @Column(name = "payload_capacity_kg")
    private Double payloadCapacityKg = 25000.0;

    @Column(name = "fuel_type", length = 30)
    private String fuelType = "DIESEL"; // DIESEL, ELECTRIC, CNG, LNG

    @Column(name = "odometer_km")
    private Double odometerKm = 100000.0;

    @Column(name = "current_city", length = 100)
    private String currentCity = "Hyderabad";

    @Column(name = "branch_id")
    private Long branchId;

    @Column(name = "assigned_driver_id")
    private Long assignedDriverId;

    @Column(name = "assigned_driver_name", length = 100)
    private String assignedDriverName;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Vehicle() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public Integer getManufacturingYear() { return manufacturingYear; }
    public void setManufacturingYear(Integer manufacturingYear) { this.manufacturingYear = manufacturingYear; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    public Double getPayloadCapacityKg() { return payloadCapacityKg; }
    public void setPayloadCapacityKg(Double payloadCapacityKg) { this.payloadCapacityKg = payloadCapacityKg; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public Double getOdometerKm() { return odometerKm; }
    public void setOdometerKm(Double odometerKm) { this.odometerKm = odometerKm; }
    public String getCurrentCity() { return currentCity; }
    public void setCurrentCity(String currentCity) { this.currentCity = currentCity; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public Long getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(Long assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public String getAssignedDriverName() { return assignedDriverName; }
    public void setAssignedDriverName(String assignedDriverName) { this.assignedDriverName = assignedDriverName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
