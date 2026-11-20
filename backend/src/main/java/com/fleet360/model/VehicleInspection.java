package com.fleet360.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_inspections")
public class VehicleInspection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private String inspectorName;
    private String inspectionDate;
    private Integer odometerKm;
    private String tiresStatus;
    private String brakesStatus;
    private String lightsStatus;
    private String fluidsStatus;
    private String overallStatus; // Passed, Action Required, Out of Service
    @Column(length = 1000)
    private String notes;

    public VehicleInspection() {}

    public VehicleInspection(String vehicleReg, String inspectorName, String inspectionDate,
                             Integer odometerKm, String tiresStatus, String brakesStatus,
                             String lightsStatus, String fluidsStatus, String overallStatus, String notes) {
        this.vehicleReg = vehicleReg;
        this.inspectorName = inspectorName;
        this.inspectionDate = inspectionDate;
        this.odometerKm = odometerKm;
        this.tiresStatus = tiresStatus;
        this.brakesStatus = brakesStatus;
        this.lightsStatus = lightsStatus;
        this.fluidsStatus = fluidsStatus;
        this.overallStatus = overallStatus;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getInspectorName() { return inspectorName; }
    public void setInspectorName(String inspectorName) { this.inspectorName = inspectorName; }
    public String getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(String inspectionDate) { this.inspectionDate = inspectionDate; }
    public Integer getOdometerKm() { return odometerKm; }
    public void setOdometerKm(Integer odometerKm) { this.odometerKm = odometerKm; }
    public String getTiresStatus() { return tiresStatus; }
    public void setTiresStatus(String tiresStatus) { this.tiresStatus = tiresStatus; }
    public String getBrakesStatus() { return brakesStatus; }
    public void setBrakesStatus(String brakesStatus) { this.brakesStatus = brakesStatus; }
    public String getLightsStatus() { return lightsStatus; }
    public void setLightsStatus(String lightsStatus) { this.lightsStatus = lightsStatus; }
    public String getFluidsStatus() { return fluidsStatus; }
    public void setFluidsStatus(String fluidsStatus) { this.fluidsStatus = fluidsStatus; }
    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
