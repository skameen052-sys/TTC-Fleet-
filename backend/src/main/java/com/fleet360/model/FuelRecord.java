package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_records")
public class FuelRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private LocalDate recordDate;
    private Double liters;
    private Double cost;
    private Integer odometer;
    private String fuelStation;
    private Boolean fullTank;

    public FuelRecord() {}

    public FuelRecord(String vehicleReg, LocalDate recordDate, Double liters, Double cost,
                      Integer odometer, String fuelStation, Boolean fullTank) {
        this.vehicleReg = vehicleReg;
        this.recordDate = recordDate;
        this.liters = liters;
        this.cost = cost;
        this.odometer = odometer;
        this.fuelStation = fuelStation;
        this.fullTank = fullTank;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public Double getLiters() { return liters; }
    public void setLiters(Double liters) { this.liters = liters; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    public Integer getOdometer() { return odometer; }
    public void setOdometer(Integer odometer) { this.odometer = odometer; }
    public String getFuelStation() { return fuelStation; }
    public void setFuelStation(String fuelStation) { this.fuelStation = fuelStation; }
    public Boolean getFullTank() { return fullTank; }
    public void setFullTank(Boolean fullTank) { this.fullTank = fullTank; }
}
