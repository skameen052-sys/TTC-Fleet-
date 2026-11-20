package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "gps_locations")
public class GpsLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_plate", nullable = false, length = 30)
    private String vehiclePlate;

    @Column(name = "driver_name", length = 100)
    private String driverName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "speed_kmph")
    private Double speedKmph = 0.0;

    @Column(name = "heading_degrees")
    private Double headingDegrees = 0.0;

    @Column(name = "altitude_meters")
    private Double altitudeMeters = 540.0;

    @Column(name = "current_address", length = 200)
    private String currentAddress;

    @Column(name = "engine_status", length = 30)
    private String engineStatus = "RUNNING"; // RUNNING, IDLE, OFF

    @Column
    private Boolean ignition = true;

    @Column(name = "fuel_level_percent")
    private Double fuelLevelPercent = 78.5;

    @Column(name = "last_ping_at")
    private Instant lastPingAt = Instant.now();

    public GpsLocation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getSpeedKmph() { return speedKmph; }
    public void setSpeedKmph(Double speedKmph) { this.speedKmph = speedKmph; }
    public Double getHeadingDegrees() { return headingDegrees; }
    public void setHeadingDegrees(Double headingDegrees) { this.headingDegrees = headingDegrees; }
    public Double getAltitudeMeters() { return altitudeMeters; }
    public void setAltitudeMeters(Double altitudeMeters) { this.altitudeMeters = altitudeMeters; }
    public String getCurrentAddress() { return currentAddress; }
    public void setCurrentAddress(String currentAddress) { this.currentAddress = currentAddress; }
    public String getEngineStatus() { return engineStatus; }
    public void setEngineStatus(String engineStatus) { this.engineStatus = engineStatus; }
    public Boolean getIgnition() { return ignition; }
    public void setIgnition(Boolean ignition) { this.ignition = ignition; }
    public Double getFuelLevelPercent() { return fuelLevelPercent; }
    public void setFuelLevelPercent(Double fuelLevelPercent) { this.fuelLevelPercent = fuelLevelPercent; }
    public Instant getLastPingAt() { return lastPingAt; }
    public void setLastPingAt(Instant lastPingAt) { this.lastPingAt = lastPingAt; }
}
