package management.resident_management.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.LoginRequest;
import management.resident_management.dto.LoginResponse;
import management.resident_management.dto.TokenResponse;
import management.resident_management.dto.RegisterDto;
import management.resident_management.entity.User;
import management.resident_management.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(loginRequest, response));
    }

    @GetMapping("/me")
    public ResponseEntity<Optional<User>> getCurrentUser(@RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok(authService.getCurrentUser(accessToken));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDto registerDto) {
        return ResponseEntity.ok(authService.register(registerDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
}