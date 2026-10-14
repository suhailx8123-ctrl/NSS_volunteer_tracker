package com.campus.volunteering.controller;

import com.campus.volunteering.dto.AuthRequest;
import com.campus.volunteering.dto.AuthResponse;
import com.campus.volunteering.dto.RegisterRequest;
import com.campus.volunteering.model.Role;
import com.campus.volunteering.model.User;
import com.campus.volunteering.repository.UserRepository;
import com.campus.volunteering.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        AuthResponse response = AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .rollNumber(user.getRollNumber())
                .department(user.getDepartment())
                .semester(user.getSemester())
                .email(user.getEmail())
                .role(user.getRole())
                .totalVerifiedHours(user.getTotalVerifiedHours())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Email is already registered in the system.");
        }

        if (userRepository.existsByRollNumber(signUpRequest.getRollNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Roll number is already registered.");
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .rollNumber(signUpRequest.getRollNumber())
                .department(signUpRequest.getDepartment())
                .semester(signUpRequest.getSemester())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.STUDENT)
                .totalVerifiedHours(0.0)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromUsername(savedUser.getEmail());

        AuthResponse response = AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .rollNumber(savedUser.getRollNumber())
                .department(savedUser.getDepartment())
                .semester(savedUser.getSemester())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .totalVerifiedHours(savedUser.getTotalVerifiedHours())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
