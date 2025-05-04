package management.resident_management.service;

import jakarta.servlet.http.Cookie;
import management.resident_management.dto.LoginRequest;
import management.resident_management.dto.LoginResponse;
import management.resident_management.dto.RegisterDto;
import management.resident_management.dto.TokenResponse;
import management.resident_management.entity.Admin;
import management.resident_management.entity.Resident;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.ResidentRepository;
import management.resident_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import management.resident_management.until.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

//    public Map<String, Object> authenticateUser(String email, String password) {
//        Map<String, Object> response = new HashMap<>();
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
//
//        if (!passwordEncoder.matches(password, user.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        // Add user information to response
//        response.put("id", user.getId());
//        response.put("email", user.getEmail());
//        response.put("name", user.getName());
//        response.put("role", user.getRole());
//
//        // Add redirect path based on role
//        if (user.getRole().equals("ADMIN")) {
//            response.put("redirectPath", "/admin/dashboard");
//        } else if (user.getRole().equals("RESIDENT")) {
//            response.put("redirectPath", "/resident/dashboard");
//        }
//
//        return response;
//    }

    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Email không tồn tại");
        }

        User user = userOptional.get();
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        TokenResponse tokenResponse = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getPassword(), user.getCreatedAt());

        String accessToken = tokenResponse.getAccessToken();
        String refreshToken = tokenResponse.getRefreshToken();
        // Set HTTP-only cookies
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true); // Chỉ dùng HTTPS
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(3600); // 1 gio
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(86400); // 1 ngày
        response.addCookie(refreshTokenCookie);

        return new LoginResponse(tokenResponse, user.getRole().toString());
    }

    @Transactional
    public User register(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Resident resident = new Resident();
        resident.setEmail(registerDto.getEmail());
        resident.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        resident.setRole(UserRole.RESIDENT);
        resident.setName(registerDto.getName());
        resident.setPhoneNumber(registerDto.getPhoneNumber());
        resident.setUnitNumber(registerDto.getUnitNumber());

        return userRepository.save(resident);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // Clear the security context
        SecurityContextHolder.clearContext();
        
        // Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear any cookies if needed
        // response.addCookie(new Cookie("JSESSIONID", null));
        
        // Set cache control headers to prevent caching
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
    }

    public Optional<User> getCurrentUser(String token) {
        return userRepository.findById(jwtUtil.getIdFromAccessToken(token));
    }


    public TokenResponse refreshToken(String refreshToken) {
        return jwtUtil.generateToken(refreshToken);
    }

}