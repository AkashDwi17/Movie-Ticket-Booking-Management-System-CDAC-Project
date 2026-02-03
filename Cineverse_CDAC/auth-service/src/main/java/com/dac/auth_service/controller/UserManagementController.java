package com.dac.auth_service.controller;

import com.dac.auth_service.Repository.UserRepository;
import com.dac.auth_service.entity.Role;
import com.dac.auth_service.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserRepository repo;

    // SUPER_ADMIN → Get all users
    @GetMapping
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // SUPER_ADMIN → Update role
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<?> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return repo.findById(id)
                .map(user -> {
                    String newRole = body.get("role");
                    // 🔹 make sure we handle lower/upper case correctly
                    user.setRole(Role.valueOf(newRole.toUpperCase()));
                    repo.save(user);
                    return ResponseEntity.ok(Map.of("message", "Role updated"));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "User not found")));
    }


    // SUPER_ADMIN → Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }
}
