package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_number", nullable = false, unique = true, length = 40)
    private String tripNumber;

    @Column(name = "shipment_number", length = 40)
    private String shipmentNumber;

    @Column(name = "vehicle_plate", nullable = false, length = 30)
    private String vehiclePlate;

    @Column(name = "driver_name", nullable = false, length = 100)
    private String driverName;

    @Column(nullable = false, length = 100)
    private String origin;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "planned_start_time")
    private Instant plannedStartTime;

    @Column(name = "actual_start_time")
    private Instant actualStartTime;

    @Column(name = "planned_end_time")
    private Instant plannedEndTime;

    @Column(name = "actual_end_time")
    private Instant actualEndTime;

    @Column(name = "distance_km")
    private Double distanceKm = 450.0;

    @Column(name = "fuel_used_liters")
    private Double fuelUsedLiters = 110.0;

    @Column(nullable = false, length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, ACTIVE, COMPLETED, CANCELLED

    @Column(name = "route_code", length = 40)
    private String routeCode;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Trip() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTripNumber() { return tripNumber; }
    public void setTripNumber(String tripNumber) { this.tripNumber = tripNumber; }
    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }
    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Instant getPlannedStartTime() { return plannedStartTime; }
    public void setPlannedStartTime(Instant plannedStartTime) { this.plannedStartTime = plannedStartTime; }
    public Instant getActualStartTime() { return actualStartTime; }
    public void setActualStartTime(Instant actualStartTime) { this.actualStartTime = actualStartTime; }
    public Instant getPlannedEndTime() { return plannedEndTime; }
    public void setPlannedEndTime(Instant plannedEndTime) { this.plannedEndTime = plannedEndTime; }
    public Instant getActualEndTime() { return actualEndTime; }
    public void setActualEndTime(Instant actualEndTime) { this.actualEndTime = actualEndTime; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Double getFuelUsedLiters() { return fuelUsedLiters; }
    public void setFuelUsedLiters(Double fuelUsedLiters) { this.fuelUsedLiters = fuelUsedLiters; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRouteCode() { return routeCode; }
    public void setRouteCode(String routeCode) { this.routeCode = routeCode; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
