package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shipmentId;

    private String orderId;
    private String customerId;
    private String customerName;

    private String origin;
    private String destination;
    private String dispatchDate;
    private String expectedDelivery;

    private String status; // Created, Processing, Ready for Dispatch, In Transit, Delivered, Delayed, Cancelled
    private String assignedVehicleReg;
    private String assignedDriver;

    private boolean requiresWarehouse = false;
    private String warehouseId;
    private String warehouseStatus;

    private Double estimatedDistanceKm;
    private Integer progressPercent = 0;
    private String currentLocation;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Shipment() {}

    public Shipment(String shipmentId, String orderId, String customerId, String customerName,
                    String origin, String destination, String dispatchDate, String expectedDelivery,
                    String status, String assignedVehicleReg, String assignedDriver,
                    boolean requiresWarehouse, String warehouseId, Double estimatedDistanceKm) {
        this.shipmentId = shipmentId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.origin = origin;
        this.destination = destination;
        this.dispatchDate = dispatchDate;
        this.expectedDelivery = expectedDelivery;
        this.status = status;
        this.assignedVehicleReg = assignedVehicleReg;
        this.assignedDriver = assignedDriver;
        this.requiresWarehouse = requiresWarehouse;
        this.warehouseId = warehouseId;
        this.estimatedDistanceKm = estimatedDistanceKm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getDispatchDate() { return dispatchDate; }
    public void setDispatchDate(String dispatchDate) { this.dispatchDate = dispatchDate; }
    public String getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(String expectedDelivery) { this.expectedDelivery = expectedDelivery; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; this.updatedAt = LocalDateTime.now(); }
    public String getAssignedVehicleReg() { return assignedVehicleReg; }
    public void setAssignedVehicleReg(String assignedVehicleReg) { this.assignedVehicleReg = assignedVehicleReg; }
    public String getAssignedDriver() { return assignedDriver; }
    public void setAssignedDriver(String assignedDriver) { this.assignedDriver = assignedDriver; }
    public boolean isRequiresWarehouse() { return requiresWarehouse; }
    public void setRequiresWarehouse(boolean requiresWarehouse) { this.requiresWarehouse = requiresWarehouse; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseStatus() { return warehouseStatus; }
    public void setWarehouseStatus(String warehouseStatus) { this.warehouseStatus = warehouseStatus; }
    public Double getEstimatedDistanceKm() { return estimatedDistanceKm; }
    public void setEstimatedDistanceKm(Double estimatedDistanceKm) { this.estimatedDistanceKm = estimatedDistanceKm; }
    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
