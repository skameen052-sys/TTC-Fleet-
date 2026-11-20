package com.fleet360.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code; // D-01
    private String fullName;
    private String licenseNumber;
    private String phone;
    private String email;
    private String status; // On Duty, Available, Off Duty
    private Double rating;
    private Integer experienceYears;
    private Integer safetyScore;
    private String assignedVehicleReg;
    private Integer tripsCompleted;

    public Driver() {}

    public Driver(String code, String fullName, String licenseNumber, String phone,
                  String email, String status, Double rating, Integer experienceYears,
                  Integer safetyScore, String assignedVehicleReg, Integer tripsCompleted) {
        this.code = code;
        this.fullName = fullName;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.rating = rating;
        this.experienceYears = experienceYears;
        this.safetyScore = safetyScore;
        this.assignedVehicleReg = assignedVehicleReg;
        this.tripsCompleted = tripsCompleted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Integer getSafetyScore() { return safetyScore; }
    public void setSafetyScore(Integer safetyScore) { this.safetyScore = safetyScore; }
    public String getAssignedVehicleReg() { return assignedVehicleReg; }
    public void setAssignedVehicleReg(String assignedVehicleReg) { this.assignedVehicleReg = assignedVehicleReg; }
    public Integer getTripsCompleted() { return tripsCompleted; }
    public void setTripsCompleted(Integer tripsCompleted) { this.tripsCompleted = tripsCompleted; }
}
