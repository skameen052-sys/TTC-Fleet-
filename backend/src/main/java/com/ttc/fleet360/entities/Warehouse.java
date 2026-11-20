package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "warehouses")
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_code", nullable = false, unique = true, length = 30)
    private String warehouseCode;

    @Column(name = "warehouse_name", nullable = false, length = 150)
    private String warehouseName;

    @Column(name = "address_line", columnDefinition = "TEXT")
    private String addressLine;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "total_capacity_sq_ft")
    private Double totalCapacitySqFt = 40000.0;

    @Column(name = "occupied_capacity_sq_ft")
    private Double occupiedCapacitySqFt = 24000.0;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(nullable = false, length = 30)
    private String status = "OPERATIONAL"; // OPERATIONAL, FULL, MAINTENANCE

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Warehouse() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public Double getTotalCapacitySqFt() { return totalCapacitySqFt; }
    public void setTotalCapacitySqFt(Double totalCapacitySqFt) { this.totalCapacitySqFt = totalCapacitySqFt; }
    public Double getOccupiedCapacitySqFt() { return occupiedCapacitySqFt; }
    public void setOccupiedCapacitySqFt(Double occupiedCapacitySqFt) { this.occupiedCapacitySqFt = occupiedCapacitySqFt; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
