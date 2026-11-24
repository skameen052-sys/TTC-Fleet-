package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "billing_invoices")
public class BillingInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceId;

    private String orderId;
    private String shipmentId;
    private String customerId;
    private String customerName;

    private Double amount;
    private Double tax;
    private Double total;

    private String status; // Pending, Processing, Paid, Overdue, Cancelled
    private String dueDate;
    private String paidDate;
    private String paymentMethod;
    private String paymentRef;

    @Column(length = 2000)
    private String itemsJson;

    private LocalDateTime createdAt = LocalDateTime.now();

    public BillingInvoice() {}

    public BillingInvoice(String invoiceId, String orderId, String shipmentId, String customerId,
                          String customerName, Double amount, Double tax, Double total,
                          String status, String dueDate, String itemsJson) {
        this.invoiceId = invoiceId;
        this.orderId = orderId;
        this.shipmentId = shipmentId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.amount = amount;
        this.tax = tax;
        this.total = total;
        this.status = status;
        this.dueDate = dueDate;
        this.itemsJson = itemsJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getPaidDate() { return paidDate; }
    public void setPaidDate(String paidDate) { this.paidDate = paidDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }
    public String getItemsJson() { return itemsJson; }
    public void setItemsJson(String itemsJson) { this.itemsJson = itemsJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
