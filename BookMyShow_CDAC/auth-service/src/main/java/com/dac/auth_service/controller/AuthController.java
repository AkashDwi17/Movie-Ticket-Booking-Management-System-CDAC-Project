package com.dac.auth_service.controller;

import com.dac.auth_service.dto.LoginRequest;
import com.dac.auth_service.dto.SignupRequest;
import com.dac.auth_service.entity.Role;
import com.dac.auth_service.entity.User;
import com.dac.auth_service.Repository.UserRepository;
import com.dac.auth_service.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    // SIGNUP  — FIXED ROLE HANDLING
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest dto) {

        if (repo.findByUsername(dto.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        if (repo.findByPhone(dto.phone()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone already used"));
        }

        //  Proper role mapping (SUPER_ADMIN, ADMIN, USER)
        Role role = Role.USER;
        if (dto.role() != null) {
            role = Role.valueOf(dto.role().toUpperCase());
        }

        User user = User.builder()
                .username(dto.username())
                .password(encoder.encode(dto.password()))
                .role(role)
                .phone(dto.phone())
                .city(dto.city())
                .state(dto.state())
                .build();

        repo.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // LOGIN  — RETURNS TOKEN + ROLE + USERID

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dto) {

        return repo.findByUsername(dto.username())
                .map(user -> {

                    if (!encoder.matches(dto.password(), user.getPassword())) {
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                    }

                    // ⭐ TOKEN WITH ID + ROLE
                    String token = jwtService.generateToken(user);

                    return ResponseEntity.ok(
                            Map.of(
                                    "token", token,
                                    "userId", user.getId(),
                                    "username", user.getUsername(),
                                    "role", user.getRole().name()
                            )
                    );
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    // GET USER BY USERNAME

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {

        return repo.findByUsername(username)
                .map(user -> ResponseEntity.ok(
                        Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "role", user.getRole().name()
                        )
                ))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
