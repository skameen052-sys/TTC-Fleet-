package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.User;
import com.ttc.fleet360.exceptions.BadRequestException;
import com.ttc.fleet360.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<User>> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User account not found"));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<User>> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User account not found"));

        if (payload.containsKey("firstName")) user.setFirstName(payload.get("firstName"));
        if (payload.containsKey("lastName")) user.setLastName(payload.get("lastName"));
        if (payload.containsKey("phoneNumber")) user.setPhoneNumber(payload.get("phoneNumber"));
        if (payload.containsKey("department")) user.setDepartment(payload.get("department"));
        if (payload.containsKey("designation")) user.setDesignation(payload.get("designation"));

        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", saved));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User account not found"));

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
