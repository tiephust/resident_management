package management.resident_management.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.LoginRequest;
import management.resident_management.dto.RegisterDto;
import management.resident_management.dto.TokenResponse;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.UserRepository;
import management.resident_management.until.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public TokenResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        logger.info("Processing login for email: {}", loginRequest.getEmail());
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    logger.error("Email not found: {}", loginRequest.getEmail());
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email không tồn tại");
                });

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logger.error("Incorrect password for email: {}", loginRequest.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mật khẩu không đúng");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("Authentication set for user: {}", user.getEmail());

        TokenResponse tokenResponse = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getCreatedAt()
        );
        logger.info("Generated tokens for user: {}", user.getEmail());

        setAuthCookies(response, tokenResponse, user.getRole().toString());
        return tokenResponse;
    }

    private void setAuthCookies(HttpServletResponse response, TokenResponse tokenResponse, String role) {
        logger.debug("Setting cookies: accessToken={}, refreshToken={}, userRole={}",
                tokenResponse.getAccessToken().substring(0, 10) + "...",
                tokenResponse.getRefreshToken().substring(0, 10) + "...",
                role);

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", tokenResponse.getAccessToken())
                .httpOnly(true)
                .secure(false) // Không yêu cầu secure trên localhost
                .path("/")
                .maxAge(3600)
                .sameSite("None") // Thử SameSite: None cho localhost
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(86400)
                .sameSite("None")
                .build();

        ResponseCookie roleCookie = ResponseCookie.from("userRole", role)
                .httpOnly(false)
                .secure(false)
                .path("/")
                .maxAge(3600)
                .sameSite("None")
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        response.addHeader("Set-Cookie", roleCookie.toString());
        logger.info("Cookies set in response: accessToken, refreshToken, userRole");
    }

    @Transactional
    public User register(RegisterDto registerDto) {
        logger.info("Processing registration for email: {}", registerDto.getEmail());
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            logger.error("Email already exists: {}", registerDto.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(UserRole.RESIDENT);
        user.setName(registerDto.getName());
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setUnitNumber(registerDto.getUnitNumber());

        User savedUser = userRepository.save(user);
        logger.info("User registered: {}", savedUser.getEmail());
        return savedUser;
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        logger.info("Processing logout");
        SecurityContextHolder.clearContext();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        clearAuthCookies(response);
        setNoCacheHeaders(response);
        logger.info("User logged out, cookies cleared");
    }

    private void clearAuthCookies(HttpServletResponse response) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .maxAge(0)
                .path("/")
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)
                .path("/")
                .build();

        ResponseCookie roleCookie = ResponseCookie.from("userRole", "")
                .maxAge(0)
                .path("/")
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        response.addHeader("Set-Cookie", roleCookie.toString());
    }

    private void setNoCacheHeaders(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
    }

    public Optional<User> getCurrentUser(String token) {
        Long userId = jwtUtil.getIdFromAccessToken(token);
        logger.info("Fetching user with ID: {}", userId);
        return userRepository.findById(userId);
    }

    public TokenResponse refreshToken(String refreshToken) {
        logger.info("Processing refresh token");
        if (!jwtUtil.isRefreshTokenValid(refreshToken)) {
            logger.error("Invalid refresh token");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
        logger.info("Generating new token from refresh token");
        return jwtUtil.generateToken(refreshToken);
    }
}