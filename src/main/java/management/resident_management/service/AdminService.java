package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import management.resident_management.entity.Admin;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.AdminRepository;
import management.resident_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        // Only initialize if no admins exist
        if (adminRepository.count() == 0) {
            // Create super admin with default credentials
            Admin superAdmin = new Admin();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail("superadmin@example.com");
            superAdmin.setPassword(passwordEncoder.encode("admin123"));
            superAdmin.setRole(UserRole.ADMIN);
            superAdmin.setActive(true);
            superAdmin.setSalary(100000L);
            superAdmin.setCreatedAt(LocalDateTime.now());
            superAdmin.setUpdatedAt(LocalDateTime.now());
            adminRepository.save(superAdmin);

            // Create department admins
            String[] departments = {"Management", "Finance", "Operations"};
            for (int i = 0; i < departments.length; i++) {
                Admin admin = new Admin();
                admin.setName("Admin " + (i + 1));
                admin.setEmail("admin" + (i + 1) + "@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                admin.setActive(true);
                admin.setSalary(80000L);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                adminRepository.save(admin);
            }
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllResidents() {
        return userRepository.findByRole(UserRole.RESIDENT);
    }

    @Transactional
    public Admin createAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        return adminRepository.save(admin);
    }

    @Transactional
    public User activateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
} 