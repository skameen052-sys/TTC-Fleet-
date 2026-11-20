package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driver_code", nullable = false, unique = true, length = 30)
    private String driverCode;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(length = 120)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "license_number", nullable = false, length = 50)
    private String licenseNumber;

    @Column(name = "license_category", length = 50)
    private String licenseCategory = "HEAVY_TRANSPORT";

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "medical_cert_expiry")
    private LocalDate medicalCertExpiry;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED

    @Column(nullable = false, length = 30)
    private String availability = "AVAILABLE"; // AVAILABLE, ON_DUTY, ON_LEAVE, RESTING

    @Column(name = "experience_years")
    private Integer experienceYears = 5;

    @Column
    private Double rating = 4.8;

    @Column(name = "emergency_contact", length = 100)
    private String emergencyContact;

    @Column(name = "assigned_vehicle_plate", length = 30)
    private String assignedVehiclePlate;

    @Column(name = "branch_id")
    private Long branchId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Driver() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDriverCode() { return driverCode; }
    public void setDriverCode(String driverCode) { this.driverCode = driverCode; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getLicenseCategory() { return licenseCategory; }
    public void setLicenseCategory(String licenseCategory) { this.licenseCategory = licenseCategory; }
    public LocalDate getLicenseExpiryDate() { return licenseExpiryDate; }
    public void setLicenseExpiryDate(LocalDate licenseExpiryDate) { this.licenseExpiryDate = licenseExpiryDate; }
    public LocalDate getMedicalCertExpiry() { return medicalCertExpiry; }
    public void setMedicalCertExpiry(LocalDate medicalCertExpiry) { this.medicalCertExpiry = medicalCertExpiry; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getAssignedVehiclePlate() { return assignedVehiclePlate; }
    public void setAssignedVehiclePlate(String assignedVehiclePlate) { this.assignedVehiclePlate = assignedVehiclePlate; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
