package com.shiptrack.services;

import com.shiptrack.config.UserPrincipal;
import com.shiptrack.dtos.LoginRequest;
import com.shiptrack.dtos.RegisterRequest;
import com.shiptrack.dtos.AuthResponse;
import com.shiptrack.models.Role;
import com.shiptrack.models.User;
import com.shiptrack.repositories.UserRepository;
import com.shiptrack.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        // Check email not already taken
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Build and save the user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.BUSINESS)
                .phone(request.getPhone())
                .build();

        userRepository.save(user);

        // Generate token and return
        String token = jwtUtil.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }

    public AuthResponse login(LoginRequest request) {

        // This checks the credentials — throws exception if wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // If we get here, credentials are correct
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }
}