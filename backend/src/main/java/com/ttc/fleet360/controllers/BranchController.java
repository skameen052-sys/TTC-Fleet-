package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.BranchDto;
import com.ttc.fleet360.dto.CreateBranchRequest;
import com.ttc.fleet360.services.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@Tag(name = "Branch & Location Management", description = "Endpoints for regional branches, fleet depots, and user allocation")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    @Operation(summary = "Search and list branches with pagination and status filters")
    public ResponseEntity<ApiResponse<Page<BranchDto>>> getBranches(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "branchName"));
        Page<BranchDto> branches = branchService.searchBranches(search, status, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(branches));
    }

    @GetMapping("/all")
    @Operation(summary = "Get full list of all active branches without pagination")
    public ResponseEntity<ApiResponse<List<BranchDto>>> getAllBranches() {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getAllBranchesList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get branch details by ID")
    public ResponseEntity<ApiResponse<BranchDto>> getBranchById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getBranchById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Create a new branch")
    public ResponseEntity<ApiResponse<BranchDto>> createBranch(@Valid @RequestBody CreateBranchRequest request) {
        BranchDto branch = branchService.createBranch(request);
        return ResponseEntity.ok(ApiResponse.ok("Branch created successfully", branch));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update branch information")
    public ResponseEntity<ApiResponse<BranchDto>> updateBranch(
            @PathVariable Long id,
            @RequestBody CreateBranchRequest request
    ) {
        BranchDto branch = branchService.updateBranch(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Branch updated successfully", branch));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete branch")
    public ResponseEntity<ApiResponse<String>> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok(ApiResponse.ok("Branch deleted successfully", null));
    }

    @PostMapping("/{branchId}/assign-user")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Allocate a user to a specific branch")
    public ResponseEntity<ApiResponse<String>> assignUser(
            @PathVariable Long branchId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "STAFF") String role
    ) {
        branchService.assignUserToBranch(branchId, userId, role);
        return ResponseEntity.ok(ApiResponse.ok("User assigned to branch successfully", null));
    }
}
