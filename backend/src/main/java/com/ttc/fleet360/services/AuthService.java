package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.*;
import com.ttc.fleet360.entities.LoginHistory;
import com.ttc.fleet360.entities.Role;
import com.ttc.fleet360.entities.User;
import com.ttc.fleet360.exceptions.BadRequestException;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.LoginHistoryRepository;
import com.ttc.fleet360.repositories.RoleRepository;
import com.ttc.fleet360.repositories.UserRepository;
import com.ttc.fleet360.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       LoginHistoryRepository loginHistoryRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse login(AuthRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            user.setLastLoginAt(Instant.now());
            user.setFailedLoginAttempts(0);
            userRepository.save(user);

            boolean rememberMe = Boolean.TRUE.equals(request.getRememberMe());
            String jwt = tokenProvider.generateToken(authentication, rememberMe);

            // Record success in LoginHistory
            LoginHistory history = new LoginHistory(
                    user.getEmail(),
                    "SUCCESS",
                    clientIp,
                    userAgent,
                    "India",
                    null
            );
            history.setUserId(user.getId());
            loginHistoryRepository.save(history);

            // Log to Audit Trail
            auditLogService.logActivity(user.getEmail(), "LOGIN", "AUTH", user.getId().toString(), "User logged in successfully", clientIp, "SUCCESS");

            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setTokenType("Bearer");
            response.setExpiresInMs(rememberMe ? 7 * 86400000L : 86400000L);
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            response.setFullName(user.getFullName());
            response.setDesignation(user.getDesignation());
            response.setDepartment(user.getDepartment());
            response.setProfileImageUrl(user.getProfileImageUrl());

            List<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
            response.setRoles(roleNames);

            Set<String> permissions = new HashSet<>();
            for (Role role : user.getRoles()) {
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(p -> permissions.add(p.getName()));
                }
            }
            response.setPermissions(permissions);

            return response;
        } catch (BadCredentialsException ex) {
            // Track failure
            userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
                int attempts = (u.getFailedLoginAttempts() != null ? u.getFailedLoginAttempts() : 0) + 1;
                u.setFailedLoginAttempts(attempts);
                if (attempts >= 5) {
                    u.setAccountLocked(true);
                }
                userRepository.save(u);
            });

            LoginHistory failedHistory = new LoginHistory(
                    request.getEmail(),
                    "FAILED_BAD_CREDENTIALS",
                    clientIp,
                    userAgent,
                    "Unknown",
                    "Invalid password"
            );
            loginHistoryRepository.save(failedHistory);

            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional
    public User register(RegisterRequest request, HttpServletRequest httpRequest) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDepartment(request.getDepartment() != null ? request.getDepartment() : "General Logistics");
        user.setDesignation(request.getDesignation() != null ? request.getDesignation() : "Staff");
        user.setIsActive(true);

        String roleToAssign = request.getRequestedRole() != null && !request.getRequestedRole().isBlank()
                ? request.getRequestedRole()
                : "ROLE_ADMIN";
        Role role = roleRepository.findByName(roleToAssign)
                .orElseGet(() -> roleRepository.findByName("ROLE_ADMIN").orElseThrow());
        user.setRoles(Set.of(role));

        User saved = userRepository.save(user);

        String clientIp = httpRequest != null ? httpRequest.getRemoteAddr() : "127.0.0.1";
        auditLogService.logActivity(saved.getEmail(), "REGISTER", "USERS", saved.getId().toString(),
                "New user registered: " + saved.getFullName(), clientIp, "SUCCESS");

        return saved;
    }

    public void logout(String email, HttpServletRequest httpRequest) {
        String clientIp = httpRequest != null ? httpRequest.getRemoteAddr() : "127.0.0.1";
        auditLogService.logActivity(email, "LOGOUT", "AUTH", null, "User logged out", clientIp, "SUCCESS");
    }

    @Transactional
    public String requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email " + request.getEmail()));
        // For production, an email with a reset token is dispatched. Here we provide a verified reset token.
        return "RESET-" + user.getId() + "-" + System.currentTimeMillis();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        userRepository.save(user);
        auditLogService.logActivity(user.getEmail(), "PASSWORD_RESET", "AUTH", user.getId().toString(), "Password reset successfully", "127.0.0.1", "SUCCESS");
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }
}
