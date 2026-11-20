package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "company_profiles")
public class CompanyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "brand_tagline", length = 255)
    private String brandTagline;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "tax_identifier", length = 100)
    private String taxIdentifier;

    @Column(name = "contact_email", nullable = false, length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "address_street", columnDefinition = "TEXT")
    private String addressStreet;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country = "India";

    @Column(name = "postal_code", length = 30)
    private String postalCode;

    @Column(name = "logo_s3_url", length = 500)
    private String logoS3Url;

    @Column(name = "favicon_s3_url", length = 500)
    private String faviconS3Url;

    @Column(name = "operating_currency", length = 10)
    private String operatingCurrency = "INR";

    @Column(name = "primary_timezone", length = 50)
    private String primaryTimezone = "Asia/Kolkata";

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public CompanyProfile() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getBrandTagline() { return brandTagline; }
    public void setBrandTagline(String brandTagline) { this.brandTagline = brandTagline; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getTaxIdentifier() { return taxIdentifier; }
    public void setTaxIdentifier(String taxIdentifier) { this.taxIdentifier = taxIdentifier; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getAddressStreet() { return addressStreet; }
    public void setAddressStreet(String addressStreet) { this.addressStreet = addressStreet; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getLogoS3Url() { return logoS3Url; }
    public void setLogoS3Url(String logoS3Url) { this.logoS3Url = logoS3Url; }

    public String getFaviconS3Url() { return faviconS3Url; }
    public void setFaviconS3Url(String faviconS3Url) { this.faviconS3Url = faviconS3Url; }

    public String getOperatingCurrency() { return operatingCurrency; }
    public void setOperatingCurrency(String operatingCurrency) { this.operatingCurrency = operatingCurrency; }

    public String getPrimaryTimezone() { return primaryTimezone; }
    public void setPrimaryTimezone(String primaryTimezone) { this.primaryTimezone = primaryTimezone; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
