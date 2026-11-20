package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gps_telemetry")
public class LiveGpsLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private String category;
    private String driverName;
    private String driverPhone;
    private Double latitude;
    private Double longitude;
    private Integer speedKmh;
    private Integer heading;
    private String status; // On Trip, Available, Under Maintenance
    private String destination;
    private String origin;
    private String eta;
    private String fuelOrBattery;
    private String odometer;
    private LocalDateTime timestamp = LocalDateTime.now();

    public LiveGpsLocation() {}

    public LiveGpsLocation(String vehicleReg, String category, String driverName, String driverPhone,
                           Double latitude, Double longitude, Integer speedKmh, Integer heading,
                           String status, String destination, String origin, String eta,
                           String fuelOrBattery, String odometer) {
        this.vehicleReg = vehicleReg;
        this.category = category;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speedKmh = speedKmh;
        this.heading = heading;
        this.status = status;
        this.destination = destination;
        this.origin = origin;
        this.eta = eta;
        this.fuelOrBattery = fuelOrBattery;
        this.odometer = odometer;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getSpeedKmh() { return speedKmh; }
    public void setSpeedKmh(Integer speedKmh) { this.speedKmh = speedKmh; }
    public Integer getHeading() { return heading; }
    public void setHeading(Integer heading) { this.heading = heading; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
    public String getFuelOrBattery() { return fuelOrBattery; }
    public void setFuelOrBattery(String fuelOrBattery) { this.fuelOrBattery = fuelOrBattery; }
    public String getOdometer() { return odometer; }
    public void setOdometer(String odometer) { this.odometer = odometer; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
