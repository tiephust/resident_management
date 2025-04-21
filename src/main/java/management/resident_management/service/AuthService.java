package management.resident_management.service;

import management.resident_management.dto.LoginRequest;
import management.resident_management.dto.LoginResponse;
import management.resident_management.dto.RegisterDto;
import management.resident_management.entity.Admin;
import management.resident_management.entity.Resident;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.ResidentRepository;
import management.resident_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;

    public Map<String, Object> authenticateUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Add user information to response
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole());

        // Add redirect path based on role
        if (user.getRole().equals("ADMIN")) {
            response.put("redirectPath", "/admin/dashboard");
        } else if (user.getRole().equals("RESIDENT")) {
            response.put("redirectPath", "/resident/dashboard");
        }

        return response;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Email không tồn tại");
        }

        User user = userOptional.get();
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        // Tạo token đơn giản (trong thực tế nên sử dụng JWT)
        String token = "dummy-token-" + user.getId();

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
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

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 