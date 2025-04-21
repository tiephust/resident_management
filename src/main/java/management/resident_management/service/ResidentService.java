package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;
import management.resident_management.repository.ResidentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResidentService {
    private final ResidentRepository residentRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        if (residentRepository.count() == 0) {
            for (int i = 0; i < 10; i++) {
                Resident resident = new Resident();
                resident.setName("Resident " + (i + 1));
                resident.setEmail("resident" + (i + 1) + "@example.com");
                resident.setPassword(passwordEncoder.encode("password123"));
                resident.setRole(UserRole.RESIDENT);
                resident.setActive(true);
                resident.setCreatedAt(LocalDateTime.now());
                resident.setUpdatedAt(LocalDateTime.now());
                resident.setUnitNumber("Unit " + (i + 1));
                resident.setPhoneNumber("555-010" + i);
                residentRepository.save(resident);
            }
        }
    }
}
