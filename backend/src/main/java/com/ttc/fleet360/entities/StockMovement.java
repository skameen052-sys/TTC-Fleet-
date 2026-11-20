package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "stock_movements")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_code", nullable = false, length = 30)
    private String warehouseCode;

    @Column(name = "item_code", nullable = false, length = 40)
    private String itemCode;

    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @Column(name = "movement_type", nullable = false, length = 30)
    private String movementType; // INWARD, OUTWARD, TRANSFER, ADJUSTMENT

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "reference_number", length = 50)
    private String referenceNumber;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "performed_by", length = 100)
    private String performedBy = "Warehouse Supervisor";

    @Column(name = "movement_date")
    private Instant movementDate = Instant.now();

    public StockMovement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getMovementType() { return movementType; }
    public void setMovementType(String movementType) { this.movementType = movementType; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public Instant getMovementDate() { return movementDate; }
    public void setMovementDate(Instant movementDate) { this.movementDate = movementDate; }
}
