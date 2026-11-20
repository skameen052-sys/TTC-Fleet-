package com.fleet360.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_assignments")
public class VehicleAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private String driverId;
    private String driverName;
    private String routeName;
    private String assignedDate;
    private String status; // Active, Completed
    private String expectedReturn;

    public VehicleAssignment() {}

    public VehicleAssignment(String vehicleReg, String driverId, String driverName,
                             String routeName, String assignedDate, String status, String expectedReturn) {
        this.vehicleReg = vehicleReg;
        this.driverId = driverId;
        this.driverName = driverName;
        this.routeName = routeName;
        this.assignedDate = assignedDate;
        this.status = status;
        this.expectedReturn = expectedReturn;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getAssignedDate() { return assignedDate; }
    public void setAssignedDate(String assignedDate) { this.assignedDate = assignedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getExpectedReturn() { return expectedReturn; }
    public void setExpectedReturn(String expectedReturn) { this.expectedReturn = expectedReturn; }
}
