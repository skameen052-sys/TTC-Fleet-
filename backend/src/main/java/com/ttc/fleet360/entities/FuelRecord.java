package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_records")
public class FuelRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_plate", nullable = false, length = 30)
    private String vehiclePlate;

    @Column(name = "driver_name", length = 100)
    private String driverName;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate = LocalDate.now();

    @Column(nullable = false)
    private Double liters;

    @Column(name = "cost_per_liter", nullable = false)
    private BigDecimal costPerLiter;

    @Column(name = "total_cost", nullable = false)
    private BigDecimal totalCost;

    @Column(name = "odometer_reading")
    private Double odometerReading;

    @Column(name = "fuel_station", length = 150)
    private String fuelStation = "IOCL Commercial Highway Depot";

    @Column(name = "payment_method", length = 40)
    private String paymentMethod = "FLEET_CARD";

    @Column(name = "receipt_number", length = 50)
    private String receiptNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public FuelRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public Double getLiters() { return liters; }
    public void setLiters(Double liters) { this.liters = liters; }
    public BigDecimal getCostPerLiter() { return costPerLiter; }
    public void setCostPerLiter(BigDecimal costPerLiter) { this.costPerLiter = costPerLiter; }
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    public Double getOdometerReading() { return odometerReading; }
    public void setOdometerReading(Double odometerReading) { this.odometerReading = odometerReading; }
    public String getFuelStation() { return fuelStation; }
    public void setFuelStation(String fuelStation) { this.fuelStation = fuelStation; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
