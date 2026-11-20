package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.PermissionDto;
import com.ttc.fleet360.dto.RoleDto;
import com.ttc.fleet360.entities.Permission;
import com.ttc.fleet360.entities.Role;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.PermissionRepository;
import com.ttc.fleet360.repositories.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AuditLogService auditLogService;

    public RoleService(RoleRepository roleRepository,
                       PermissionRepository permissionRepository,
                       AuditLogService auditLogService) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.auditLogService = auditLogService;
    }

    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public RoleDto getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id " + id));
        return mapToDto(role);
    }

    public List<PermissionDto> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(p -> new PermissionDto(p.getId(), p.getName(), p.getCategory(), p.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional
    public RoleDto updateRolePermissions(Long roleId, Set<String> permissionNames) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id " + roleId));

        Set<Permission> updatedPerms = new HashSet<>();
        for (String pName : permissionNames) {
            permissionRepository.findByName(pName).ifPresent(updatedPerms::add);
        }
        role.setPermissions(updatedPerms);
        Role saved = roleRepository.save(role);

        auditLogService.logActivity("admin", "UPDATE", "ROLES", roleId.toString(),
                "Updated permissions for role: " + role.getName(), "127.0.0.1", "SUCCESS");

        return mapToDto(saved);
    }

    private RoleDto mapToDto(Role r) {
        RoleDto dto = new RoleDto();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setDescription(r.getDescription());
        if (r.getPermissions() != null) {
            dto.setPermissions(r.getPermissions().stream()
                    .map(p -> new PermissionDto(p.getId(), p.getName(), p.getCategory(), p.getDescription()))
                    .collect(Collectors.toSet()));
        }
        return dto;
    }
}
