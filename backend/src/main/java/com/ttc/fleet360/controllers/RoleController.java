package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.PermissionDto;
import com.ttc.fleet360.dto.RoleDto;
import com.ttc.fleet360.services.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Role & Permissions", description = "Role-Based Access Control management and permission matrix")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @Operation(summary = "Get list of all system roles with assigned permissions")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.ok(roleService.getAllRoles()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role details by ID")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roleService.getRoleById(id)));
    }

    @GetMapping("/permissions")
    @Operation(summary = "Get all available permissions categorized")
    public ResponseEntity<ApiResponse<List<PermissionDto>>> getAllPermissions() {
        return ResponseEntity.ok(ApiResponse.ok(roleService.getAllPermissions()));
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update assigned permissions for a role")
    public ResponseEntity<ApiResponse<RoleDto>> updateRolePermissions(
            @PathVariable Long id,
            @RequestBody Set<String> permissions
    ) {
        RoleDto updated = roleService.updateRolePermissions(id, permissions);
        return ResponseEntity.ok(ApiResponse.ok("Permissions updated successfully", updated));
    }
}
