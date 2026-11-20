package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.CompanyProfileDto;
import com.ttc.fleet360.entities.CompanyProfile;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.CompanyProfileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;
    private final S3StorageService s3StorageService;
    private final AuditLogService auditLogService;

    public CompanyProfileService(CompanyProfileRepository companyProfileRepository,
                                 S3StorageService s3StorageService,
                                 AuditLogService auditLogService) {
        this.companyProfileRepository = companyProfileRepository;
        this.s3StorageService = s3StorageService;
        this.auditLogService = auditLogService;
    }

    @Cacheable(value = "companyProfile", key = "'primary'")
    public CompanyProfileDto getCompanyProfile() {
        CompanyProfile profile = companyProfileRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not configured"));
        return mapToDto(profile);
    }

    @Transactional
    @CacheEvict(value = "companyProfile", allEntries = true)
    public CompanyProfileDto updateCompanyProfile(CompanyProfileDto dto) {
        CompanyProfile profile = companyProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(CompanyProfile::new);

        if (dto.getCompanyName() != null) profile.setCompanyName(dto.getCompanyName());
        if (dto.getBrandTagline() != null) profile.setBrandTagline(dto.getBrandTagline());
        if (dto.getRegistrationNumber() != null) profile.setRegistrationNumber(dto.getRegistrationNumber());
        if (dto.getTaxIdentifier() != null) profile.setTaxIdentifier(dto.getTaxIdentifier());
        if (dto.getContactEmail() != null) profile.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) profile.setContactPhone(dto.getContactPhone());
        if (dto.getWebsiteUrl() != null) profile.setWebsiteUrl(dto.getWebsiteUrl());
        if (dto.getAddressStreet() != null) profile.setAddressStreet(dto.getAddressStreet());
        if (dto.getCity() != null) profile.setCity(dto.getCity());
        if (dto.getState() != null) profile.setState(dto.getState());
        if (dto.getCountry() != null) profile.setCountry(dto.getCountry());
        if (dto.getPostalCode() != null) profile.setPostalCode(dto.getPostalCode());
        if (dto.getOperatingCurrency() != null) profile.setOperatingCurrency(dto.getOperatingCurrency());
        if (dto.getPrimaryTimezone() != null) profile.setPrimaryTimezone(dto.getPrimaryTimezone());

        CompanyProfile saved = companyProfileRepository.save(profile);
        auditLogService.logActivity("admin", "UPDATE", "COMPANY", saved.getId().toString(),
                "Updated enterprise company profile", "127.0.0.1", "SUCCESS");

        return mapToDto(saved);
    }

    @Transactional
    @CacheEvict(value = "companyProfile", allEntries = true)
    public String uploadLogo(MultipartFile file) throws IOException {
        String s3Url = s3StorageService.uploadFile(file, "logos");
        CompanyProfile profile = companyProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(CompanyProfile::new);
        profile.setLogoS3Url(s3Url);
        companyProfileRepository.save(profile);

        auditLogService.logActivity("admin", "UPLOAD", "COMPANY", profile.getId() != null ? profile.getId().toString() : "1",
                "Uploaded company logo to S3: " + s3Url, "127.0.0.1", "SUCCESS");

        return s3Url;
    }

    private CompanyProfileDto mapToDto(CompanyProfile p) {
        CompanyProfileDto dto = new CompanyProfileDto();
        dto.setId(p.getId());
        dto.setCompanyName(p.getCompanyName());
        dto.setBrandTagline(p.getBrandTagline());
        dto.setRegistrationNumber(p.getRegistrationNumber());
        dto.setTaxIdentifier(p.getTaxIdentifier());
        dto.setContactEmail(p.getContactEmail());
        dto.setContactPhone(p.getContactPhone());
        dto.setWebsiteUrl(p.getWebsiteUrl());
        dto.setAddressStreet(p.getAddressStreet());
        dto.setCity(p.getCity());
        dto.setState(p.getState());
        dto.setCountry(p.getCountry());
        dto.setPostalCode(p.getPostalCode());
        dto.setLogoS3Url(p.getLogoS3Url());
        dto.setFaviconS3Url(p.getFaviconS3Url());
        dto.setOperatingCurrency(p.getOperatingCurrency());
        dto.setPrimaryTimezone(p.getPrimaryTimezone());
        return dto;
    }
}
