package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "allocation_requests")
public class AllocationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String requestId;

    private String shipmentId;
    private String orderId;
    private String requestedVehicleType;
    private Double requiredCapacityKg;
    private String route;
    private String scheduledDate;

    private String status = "Pending"; // Pending, Confirmed, Rejected

    private String assignedVehicleReg;
    private String assignedDriverId;
    private String assignedDriverName;
    private String fleetManagerNotes;

    private LocalDateTime confirmedAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public AllocationRequest() {}

    public AllocationRequest(String requestId, String shipmentId, String orderId,
                             String requestedVehicleType, Double requiredCapacityKg,
                             String route, String scheduledDate) {
        this.requestId = requestId;
        this.shipmentId = shipmentId;
        this.orderId = orderId;
        this.requestedVehicleType = requestedVehicleType;
        this.requiredCapacityKg = requiredCapacityKg;
        this.route = route;
        this.scheduledDate = scheduledDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getRequestedVehicleType() { return requestedVehicleType; }
    public void setRequestedVehicleType(String requestedVehicleType) { this.requestedVehicleType = requestedVehicleType; }
    public Double getRequiredCapacityKg() { return requiredCapacityKg; }
    public void setRequiredCapacityKg(Double requiredCapacityKg) { this.requiredCapacityKg = requiredCapacityKg; }
    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAssignedVehicleReg() { return assignedVehicleReg; }
    public void setAssignedVehicleReg(String assignedVehicleReg) { this.assignedVehicleReg = assignedVehicleReg; }
    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    public String getAssignedDriverName() { return assignedDriverName; }
    public void setAssignedDriverName(String assignedDriverName) { this.assignedDriverName = assignedDriverName; }
    public String getFleetManagerNotes() { return fleetManagerNotes; }
    public void setFleetManagerNotes(String fleetManagerNotes) { this.fleetManagerNotes = fleetManagerNotes; }
    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
