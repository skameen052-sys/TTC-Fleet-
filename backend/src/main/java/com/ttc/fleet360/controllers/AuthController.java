package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.*;
import com.ttc.fleet360.entities.User;
import com.ttc.fleet360.services.AuthService;
import com.ttc.fleet360.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for JWT authentication, registration, session, and password recovery")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        User user = authService.register(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", userService.mapToDto(user)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate token")
    public ResponseEntity<ApiResponse<String>> logout(@RequestParam(required = false) String email, HttpServletRequest httpRequest) {
        authService.logout(email != null ? email : "current-user", httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", "Session terminated"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset verification code / link")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset link generated", Map.of(
                "message", "Reset instructions dispatched to " + request.getEmail(),
                "resetToken", token
        )));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Complete password reset with new password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password has been reset successfully. Please log in with your new credentials.", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        User user = authService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        return ResponseEntity.ok(ApiResponse.ok(userService.mapToDto(user)));
    }
}
