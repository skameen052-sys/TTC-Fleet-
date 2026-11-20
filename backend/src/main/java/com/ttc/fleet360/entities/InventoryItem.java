package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_code", nullable = false, length = 30)
    private String warehouseCode;

    @Column(name = "item_code", nullable = false, unique = true, length = 40)
    private String itemCode;

    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @Column(nullable = false, length = 50)
    private String category = "GENERAL_CARGO"; // PACKAGING, SPARE_PARTS, GENERAL_CARGO, ELECTRONICS, AUTOMOTIVE

    @Column(nullable = false)
    private Integer quantity = 100;

    @Column(nullable = false, length = 20)
    private String unit = "UNITS"; // UNITS, BOXES, PALLETS, KG

    @Column(name = "min_threshold")
    private Integer minThreshold = 20;

    @Column(name = "unit_price")
    private BigDecimal unitPrice = BigDecimal.valueOf(1500.0);

    @Column(name = "location_aisle", length = 50)
    private String locationAisle = "Bay-A";

    @Column(name = "last_restocked_at")
    private LocalDate lastRestockedAt = LocalDate.now();

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public InventoryItem() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Integer getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Integer minThreshold) { this.minThreshold = minThreshold; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public String getLocationAisle() { return locationAisle; }
    public void setLocationAisle(String locationAisle) { this.locationAisle = locationAisle; }
    public LocalDate getLastRestockedAt() { return lastRestockedAt; }
    public void setLastRestockedAt(LocalDate lastRestockedAt) { this.lastRestockedAt = lastRestockedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
