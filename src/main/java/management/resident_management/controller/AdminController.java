package management.resident_management.controller;

import management.resident_management.entity.Admin;
import management.resident_management.entity.User;
import management.resident_management.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/residents")
    public ResponseEntity<List<User>> getAllResidents() {
        return ResponseEntity.ok(adminService.getAllResidents());
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.activateUser(userId));
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.deactivateUser(userId));
    }
} 