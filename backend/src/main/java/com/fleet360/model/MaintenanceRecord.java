package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private String serviceType;
    @Column(length = 1000)
    private String description;
    private String status; // Upcoming, Under Repair, Completed
    private LocalDate scheduledDate;
    private LocalDate completedDate;
    private Double cost;
    private String serviceCenter;
    private String priority; // Routine, Medium, High, Critical

    public MaintenanceRecord() {}

    public MaintenanceRecord(String vehicleReg, String serviceType, String description,
                             String status, LocalDate scheduledDate, LocalDate completedDate,
                             Double cost, String serviceCenter, String priority) {
        this.vehicleReg = vehicleReg;
        this.serviceType = serviceType;
        this.description = description;
        this.status = status;
        this.scheduledDate = scheduledDate;
        this.completedDate = completedDate;
        this.cost = cost;
        this.serviceCenter = serviceCenter;
        this.priority = priority;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
    public String getServiceCenter() { return serviceCenter; }
    public void setServiceCenter(String serviceCenter) { this.serviceCenter = serviceCenter; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
