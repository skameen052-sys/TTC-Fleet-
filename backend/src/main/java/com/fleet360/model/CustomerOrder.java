package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_orders")
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderId;

    private String customerId;
    private String customerName;
    private String customerContact;

    @Column(length = 500)
    private String pickupAddress;

    @Column(length = 500)
    private String deliveryAddress;

    private String pickupDate;
    private String expectedDeliveryDate;
    private String goodsCategory;

    @Column(length = 1000)
    private String goodsDescription;

    private Integer packageQuantity;
    private Double weightKg;

    @Column(length = 1000)
    private String specialInstructions;

    private String contactDetails;
    private String orderStatus; // Pending Approval, Approved, Rejected, Processing, Completed, Cancelled
    private Double amount;
    private String assignedShipmentId;
    private String assignedTripId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CustomerOrder() {}

    public CustomerOrder(String orderId, String customerId, String customerName, String customerContact,
                         String pickupAddress, String deliveryAddress, String pickupDate, String expectedDeliveryDate,
                         String goodsCategory, String goodsDescription, Integer packageQuantity, Double weightKg,
                         String specialInstructions, String contactDetails, String orderStatus, Double amount) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerContact = customerContact;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.pickupDate = pickupDate;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.goodsCategory = goodsCategory;
        this.goodsDescription = goodsDescription;
        this.packageQuantity = packageQuantity;
        this.weightKg = weightKg;
        this.specialInstructions = specialInstructions;
        this.contactDetails = contactDetails;
        this.orderStatus = orderStatus;
        this.amount = amount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerContact() { return customerContact; }
    public void setCustomerContact(String customerContact) { this.customerContact = customerContact; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }
    public String getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(String expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
    public String getGoodsCategory() { return goodsCategory; }
    public void setGoodsCategory(String goodsCategory) { this.goodsCategory = goodsCategory; }
    public String getGoodsDescription() { return goodsDescription; }
    public void setGoodsDescription(String goodsDescription) { this.goodsDescription = goodsDescription; }
    public Integer getPackageQuantity() { return packageQuantity; }
    public void setPackageQuantity(Integer packageQuantity) { this.packageQuantity = packageQuantity; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; this.updatedAt = LocalDateTime.now(); }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getAssignedShipmentId() { return assignedShipmentId; }
    public void setAssignedShipmentId(String assignedShipmentId) { this.assignedShipmentId = assignedShipmentId; }
    public String getAssignedTripId() { return assignedTripId; }
    public void setAssignedTripId(String assignedTripId) { this.assignedTripId = assignedTripId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
