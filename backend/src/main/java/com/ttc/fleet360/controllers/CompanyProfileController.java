package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.CompanyProfileDto;
import com.ttc.fleet360.services.CompanyProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@Tag(name = "Company Profile", description = "Enterprise identity, contact information, and logo management")
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    public CompanyProfileController(CompanyProfileService companyProfileService) {
        this.companyProfileService = companyProfileService;
    }

    @GetMapping
    @Operation(summary = "Get enterprise company profile")
    public ResponseEntity<ApiResponse<CompanyProfileDto>> getCompanyProfile() {
        return ResponseEntity.ok(ApiResponse.ok(companyProfileService.getCompanyProfile()));
    }

    @PutMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update enterprise company details")
    public ResponseEntity<ApiResponse<CompanyProfileDto>> updateCompanyProfile(@RequestBody CompanyProfileDto dto) {
        CompanyProfileDto updated = companyProfileService.updateCompanyProfile(dto);
        return ResponseEntity.ok(ApiResponse.ok("Company profile updated successfully", updated));
    }

    @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Upload company logo to AWS S3")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadLogo(@RequestParam("file") MultipartFile file) throws IOException {
        String logoUrl = companyProfileService.uploadLogo(file);
        return ResponseEntity.ok(ApiResponse.ok("Company logo uploaded successfully", Map.of("logoUrl", logoUrl)));
    }
}
