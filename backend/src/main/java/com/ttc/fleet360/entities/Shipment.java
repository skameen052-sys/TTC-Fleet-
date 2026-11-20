package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_number", nullable = false, unique = true, length = 40)
    private String shipmentNumber;

    @Column(name = "tracking_code", nullable = false, unique = true, length = 40)
    private String trackingCode;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_number", length = 40)
    private String orderNumber;

    @Column(name = "vehicle_plate", length = 30)
    private String vehiclePlate;

    @Column(name = "driver_name", length = 100)
    private String driverName;

    @Column(nullable = false, length = 30)
    private String status = "IN_TRANSIT"; // PENDING, IN_TRANSIT, DELIVERED, DELAYED, CANCELLED

    @Column(name = "origin_city", nullable = false, length = 100)
    private String originCity;

    @Column(name = "destination_city", nullable = false, length = 100)
    private String destinationCity;

    @Column(name = "estimated_departure")
    private Instant estimatedDeparture;

    @Column(name = "actual_departure")
    private Instant actualDeparture;

    @Column(name = "estimated_arrival")
    private Instant estimatedArrival;

    @Column(name = "actual_arrival")
    private Instant actualArrival;

    @Column(name = "cargo_description", length = 200)
    private String cargoDescription = "Standard Containerised Logistics";

    @Column(name = "weight_kg")
    private Double weightKg = 18000.0;

    @Column(name = "current_location", length = 150)
    private String currentLocation;

    @Column(name = "delay_reason", length = 200)
    private String delayReason;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Shipment() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }
    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOriginCity() { return originCity; }
    public void setOriginCity(String originCity) { this.originCity = originCity; }
    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
    public Instant getEstimatedDeparture() { return estimatedDeparture; }
    public void setEstimatedDeparture(Instant estimatedDeparture) { this.estimatedDeparture = estimatedDeparture; }
    public Instant getActualDeparture() { return actualDeparture; }
    public void setActualDeparture(Instant actualDeparture) { this.actualDeparture = actualDeparture; }
    public Instant getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(Instant estimatedArrival) { this.estimatedArrival = estimatedArrival; }
    public Instant getActualArrival() { return actualArrival; }
    public void setActualArrival(Instant actualArrival) { this.actualArrival = actualArrival; }
    public String getCargoDescription() { return cargoDescription; }
    public void setCargoDescription(String cargoDescription) { this.cargoDescription = cargoDescription; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
