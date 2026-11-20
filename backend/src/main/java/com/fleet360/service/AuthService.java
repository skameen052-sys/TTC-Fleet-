package com.fleet360.service;

import com.fleet360.dto.AuthRequest;
import com.fleet360.dto.AuthResponse;
import com.fleet360.model.Role;
import com.fleet360.model.User;
import com.fleet360.repository.UserRepository;
import com.fleet360.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = tokenProvider.generateTokenFromUsername(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName());
    }

    public User registerUser(String username, String email, String password, String fullName, Role role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User(username, email, passwordEncoder.encode(password), fullName, role);
        return userRepository.save(Objects.requireNonNull(user));
    }
}
