package com.shiptrack.services;

import com.shiptrack.dtos.AuthResponse;
import com.shiptrack.dtos.LoginRequest;
import com.shiptrack.dtos.RegisterRequest;
import com.shiptrack.models.Role;
import com.shiptrack.models.User;
import com.shiptrack.repositories.UserRepository;
import com.shiptrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Ahmed Alaoui")
                .email("ahmed@test.com")
                .password("hashed_password")
                .role(Role.BUSINESS)
                .isActive(true)
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setName("Ahmed Alaoui");
        registerRequest.setEmail("ahmed@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole(Role.BUSINESS);

        loginRequest = new LoginRequest();
        loginRequest.setEmail("ahmed@test.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_shouldSaveUserAndReturnToken() {
        when(userRepository.findByEmail(registerRequest.getEmail()))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("hashed_password");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);
        when(jwtUtil.generateToken(any()))
                .thenReturn("mock_jwt_token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("BUSINESS", response.getRole());
        assertEquals("Ahmed Alaoui", response.getName());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenEmailAlreadyExists() {
        when(userRepository.findByEmail(registerRequest.getEmail()))
                .thenReturn(Optional.of(testUser));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest));

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnTokenWhenCredentialsAreCorrect() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(any()))
                .thenReturn("mock_jwt_token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("BUSINESS", response.getRole());
    }
}