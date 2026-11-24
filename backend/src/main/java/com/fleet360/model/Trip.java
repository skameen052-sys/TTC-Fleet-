package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tripId;

    private String orderId;
    private String shipmentId;
    private String vehicleReg;
    private String driverId;
    private String driverName;
    private String driverPhone;

    private String startLocation;
    private String destination;
    private String departureTime;
    private String expectedArrival;
    private Double totalDistanceKm;

    private String status; // Assigned, Accepted, At Pickup, Picked Up, Started, In Transit, At Destination, Delivered, Completed, Cancelled
    private String routeCode;
    private Double fuelConsumedLiters;
    private Integer currentSpeedKmh = 0;
    private String etaHours;

    private Double latitude;
    private Double longitude;
    private LocalDateTime lastGpsUpdate;

    @Column(length = 2000)
    private String podSignature;

    @Column(length = 1000)
    private String podPhotoUrl;

    private String deliveredAt;
    private String failureReason;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Trip() {}

    public Trip(String tripId, String orderId, String shipmentId, String vehicleReg,
                String driverId, String driverName, String driverPhone, String startLocation,
                String destination, String departureTime, String expectedArrival, Double totalDistanceKm,
                String status, String routeCode) {
        this.tripId = tripId;
        this.orderId = orderId;
        this.shipmentId = shipmentId;
        this.vehicleReg = vehicleReg;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.startLocation = startLocation;
        this.destination = destination;
        this.departureTime = departureTime;
        this.expectedArrival = expectedArrival;
        this.totalDistanceKm = totalDistanceKm;
        this.status = status;
        this.routeCode = routeCode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getExpectedArrival() { return expectedArrival; }
    public void setExpectedArrival(String expectedArrival) { this.expectedArrival = expectedArrival; }
    public Double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; this.updatedAt = LocalDateTime.now(); }
    public String getRouteCode() { return routeCode; }
    public void setRouteCode(String routeCode) { this.routeCode = routeCode; }
    public Double getFuelConsumedLiters() { return fuelConsumedLiters; }
    public void setFuelConsumedLiters(Double fuelConsumedLiters) { this.fuelConsumedLiters = fuelConsumedLiters; }
    public Integer getCurrentSpeedKmh() { return currentSpeedKmh; }
    public void setCurrentSpeedKmh(Integer currentSpeedKmh) { this.currentSpeedKmh = currentSpeedKmh; }
    public String getEtaHours() { return etaHours; }
    public void setEtaHours(String etaHours) { this.etaHours = etaHours; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocalDateTime getLastGpsUpdate() { return lastGpsUpdate; }
    public void setLastGpsUpdate(LocalDateTime lastGpsUpdate) { this.lastGpsUpdate = lastGpsUpdate; }
    public String getPodSignature() { return podSignature; }
    public void setPodSignature(String podSignature) { this.podSignature = podSignature; }
    public String getPodPhotoUrl() { return podPhotoUrl; }
    public void setPodPhotoUrl(String podPhotoUrl) { this.podPhotoUrl = podPhotoUrl; }
    public String getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
