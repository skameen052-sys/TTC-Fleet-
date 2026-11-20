package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_plate", nullable = false, length = 30)
    private String vehiclePlate;

    @Column(name = "service_type", nullable = false, length = 60)
    private String serviceType; // OIL_CHANGE, BRAKE_SERVICE, TIRE_ROTATION, ENGINE_OVERHAUL, SCHEDULED_INSPECTION, ELECTRICAL_REPAIR

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate = LocalDate.now();

    @Column(nullable = false)
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(name = "odometer_reading")
    private Double odometerReading;

    @Column(name = "service_center", length = 150)
    private String serviceCenter;

    @Column(nullable = false, length = 30)
    private String status = "COMPLETED"; // SCHEDULED, IN_PROGRESS, COMPLETED

    @Column(name = "next_service_due_date")
    private LocalDate nextServiceDueDate;

    @Column(name = "next_service_odometer")
    private Double nextServiceOdometer;

    @Column(name = "technician_name", length = 100)
    private String technicianName = "Anil Sharma";

    @Column(name = "technician_notes", columnDefinition = "TEXT")
    private String technicianNotes;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public MaintenanceRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    public Double getOdometerReading() { return odometerReading; }
    public void setOdometerReading(Double odometerReading) { this.odometerReading = odometerReading; }
    public String getServiceCenter() { return serviceCenter; }
    public void setServiceCenter(String serviceCenter) { this.serviceCenter = serviceCenter; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getNextServiceDueDate() { return nextServiceDueDate; }
    public void setNextServiceDueDate(LocalDate nextServiceDueDate) { this.nextServiceDueDate = nextServiceDueDate; }
    public Double getNextServiceOdometer() { return nextServiceOdometer; }
    public void setNextServiceOdometer(Double nextServiceOdometer) { this.nextServiceOdometer = nextServiceOdometer; }
    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }
    public String getTechnicianNotes() { return technicianNotes; }
    public void setTechnicianNotes(String technicianNotes) { this.technicianNotes = technicianNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
