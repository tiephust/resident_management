package management.resident_management.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.*;
import management.resident_management.entity.User;
import management.resident_management.service.AuthService;
import management.resident_management.until.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        logger.info("Login request received for email: {}", loginRequest.getEmail());
        try {
            TokenResponse tokenResponse = authService.login(loginRequest, response);
            logger.info("Login successful for email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(tokenResponse);
        } catch (ResponseStatusException e) {
            logger.error("Login failed for email: {}. Reason: {}", loginRequest.getEmail(), e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            logger.error("Unexpected error during login for email: {}. Error: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        logger.info("Register request received for email: {}", registerDto.getEmail());
        try {
            User user = authService.register(registerDto);
            logger.info("Registration successful for email: {}", registerDto.getEmail());
            return ResponseEntity.ok(user);
        } catch (ResponseStatusException e) {
            logger.error("Registration failed for email: {}. Reason: {}", registerDto.getEmail(), e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        logger.info("Logout request received");
        authService.logout(request, response);
        logger.info("Logout successful");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        logger.info("Refresh token request received");
        try {
            TokenResponse tokenResponse = authService.refreshToken(refreshToken);
            logger.info("Refresh token successful");
            return ResponseEntity.ok(tokenResponse);
        } catch (ResponseStatusException e) {
            logger.error("Refresh token failed. Reason: {}", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody TokenResponse request) {
        logger.info("Refresh-token request received");
        try {
            if (jwtUtil.isRefreshTokenValid(request.getRefreshToken())) {
                TokenResponse newTokens = jwtUtil.generateToken(request.getRefreshToken());
                logger.info("Refresh-token successful");
                return ResponseEntity.ok(newTokens);
            }
            logger.error("Invalid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        } catch (Exception e) {
            logger.error("Refresh-token failed. Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}