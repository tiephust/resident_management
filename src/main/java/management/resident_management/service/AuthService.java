package management.resident_management.service;

import management.resident_management.dto.LoginDto;
import management.resident_management.dto.RegisterDto;
import management.resident_management.entity.Resident;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return "Login successful";
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

    public void logout() {
        SecurityContextHolder.clearContext();
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