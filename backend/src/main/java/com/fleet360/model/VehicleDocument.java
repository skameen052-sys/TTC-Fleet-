package com.fleet360.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle_documents")
public class VehicleDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleReg;
    private String documentType;
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String s3Key;
    private String status; // Valid, Expiring Soon, Expired

    public VehicleDocument() {}

    public VehicleDocument(String vehicleReg, String documentType, String documentNumber,
                           LocalDate issueDate, LocalDate expiryDate, String s3Key, String status) {
        this.vehicleReg = vehicleReg;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.s3Key = s3Key;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getS3Key() { return s3Key; }
    public void setS3Key(String s3Key) { this.s3Key = s3Key; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
