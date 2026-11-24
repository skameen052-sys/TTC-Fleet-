package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "warehouse_operations")
public class WarehouseOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String operationId;

    private String warehouseId;
    private String shipmentId;
    private String orderId;
    private String operationType; // Receiving, Storage, Staging, Dispatch
    private String status; // Pending, Received, Stored, Loaded, Dispatched

    private String bayNumber;
    private String goodsReceivedAt;
    private String loadedAt;
    private String dispatchedAt;
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public WarehouseOperation() {}

    public WarehouseOperation(String operationId, String warehouseId, String shipmentId,
                              String orderId, String operationType, String status, String bayNumber) {
        this.operationId = operationId;
        this.warehouseId = warehouseId;
        this.shipmentId = shipmentId;
        this.orderId = orderId;
        this.operationType = operationType;
        this.status = status;
        this.bayNumber = bayNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOperationId() { return operationId; }
    public void setOperationId(String operationId) { this.operationId = operationId; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBayNumber() { return bayNumber; }
    public void setBayNumber(String bayNumber) { this.bayNumber = bayNumber; }
    public String getGoodsReceivedAt() { return goodsReceivedAt; }
    public void setGoodsReceivedAt(String goodsReceivedAt) { this.goodsReceivedAt = goodsReceivedAt; }
    public String getLoadedAt() { return loadedAt; }
    public void setLoadedAt(String loadedAt) { this.loadedAt = loadedAt; }
    public String getDispatchedAt() { return dispatchedAt; }
    public void setDispatchedAt(String dispatchedAt) { this.dispatchedAt = dispatchedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
