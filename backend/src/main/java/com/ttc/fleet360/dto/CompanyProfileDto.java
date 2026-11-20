package com.ttc.fleet360.dto;

public class CompanyProfileDto {
    private Long id;
    private String companyName;
    private String brandTagline;
    private String registrationNumber;
    private String taxIdentifier;
    private String contactEmail;
    private String contactPhone;
    private String websiteUrl;
    private String addressStreet;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String logoS3Url;
    private String faviconS3Url;
    private String operatingCurrency;
    private String primaryTimezone;

    public CompanyProfileDto() {}

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
}
