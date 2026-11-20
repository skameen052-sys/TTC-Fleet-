package com.fleet360.controller;

import com.fleet360.dto.ApiResponse;
import com.fleet360.dto.AuthRequest;
import com.fleet360.dto.AuthResponse;
import com.fleet360.model.Role;
import com.fleet360.model.User;
import com.fleet360.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "JWT Token Generation & User Authentication")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT Bearer token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.authenticateUser(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register new system operator")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody Map<String, String> payload) {
        try {
            String username = payload.get("username");
            String email = payload.get("email");
            String password = payload.get("password");
            String fullName = payload.get("fullName");
            String roleStr = payload.getOrDefault("role", "ROLE_DISPATCHER");
            Role role = Role.valueOf(roleStr);

            User user = authService.registerUser(username, email, password, fullName, role);
            return ResponseEntity.ok(ApiResponse.ok("User registered successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
