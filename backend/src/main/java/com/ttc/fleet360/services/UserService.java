package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.CreateUserRequest;
import com.ttc.fleet360.dto.UpdateUserRequest;
import com.ttc.fleet360.dto.UserDto;
import com.ttc.fleet360.entities.Role;
import com.ttc.fleet360.entities.User;
import com.ttc.fleet360.exceptions.BadRequestException;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.RoleRepository;
import com.ttc.fleet360.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public Page<UserDto> searchUsers(String search, Boolean active, Pageable pageable) {
        return userRepository.searchUsers(search, active, pageable).map(this::mapToDto);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return mapToDto(user);
    }

    @Transactional
    public UserDto createUser(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("User already exists with email " + req.getEmail());
        }

        User user = new User();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setPhoneNumber(req.getPhoneNumber());
        user.setDepartment(req.getDepartment());
        user.setDesignation(req.getDesignation());
        user.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);

        Set<Role> roles = new HashSet<>();
        if (req.getRoleNames() != null && !req.getRoleNames().isEmpty()) {
            for (String rName : req.getRoleNames()) {
                roleRepository.findByName(rName).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByName("ROLE_ADMIN").ifPresent(roles::add);
        }
        user.setRoles(roles);

        User saved = userRepository.save(user);
        auditLogService.logActivity("admin", "CREATE", "USERS", saved.getId().toString(),
                "Created user " + saved.getFullName() + " (" + saved.getEmail() + ")", "127.0.0.1", "SUCCESS");

        return mapToDto(saved);
    }

    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        if (req.getDepartment() != null) user.setDepartment(req.getDepartment());
        if (req.getDesignation() != null) user.setDesignation(req.getDesignation());
        if (req.getIsActive() != null) user.setIsActive(req.getIsActive());

        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        }

        if (req.getRoleNames() != null) {
            Set<Role> roles = new HashSet<>();
            for (String rName : req.getRoleNames()) {
                roleRepository.findByName(rName).ifPresent(roles::add);
            }
            if (!roles.isEmpty()) {
                user.setRoles(roles);
            }
        }

        User updated = userRepository.save(user);
        auditLogService.logActivity("admin", "UPDATE", "USERS", updated.getId().toString(),
                "Updated user profile for " + updated.getFullName(), "127.0.0.1", "SUCCESS");

        return mapToDto(updated);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        userRepository.delete(user);
        auditLogService.logActivity("admin", "DELETE", "USERS", id.toString(),
                "Deleted user account " + user.getEmail(), "127.0.0.1", "SUCCESS");
    }

    @Transactional
    public UserDto toggleUserStatus(Long id, Boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        user.setIsActive(active);
        User updated = userRepository.save(user);
        auditLogService.logActivity("admin", "UPDATE", "USERS", id.toString(),
                (active ? "Activated" : "Deactivated") + " user account: " + user.getEmail(), "127.0.0.1", "SUCCESS");
        return mapToDto(updated);
    }

    public UserDto mapToDto(User u) {
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setPhoneNumber(u.getPhoneNumber());
        dto.setDepartment(u.getDepartment());
        dto.setDesignation(u.getDesignation());
        dto.setIsActive(u.getIsActive());
        dto.setProfileImageUrl(u.getProfileImageUrl());
        dto.setLastLoginAt(u.getLastLoginAt());
        dto.setCreatedAt(u.getCreatedAt());
        dto.setRoles(u.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return dto;
    }
}
