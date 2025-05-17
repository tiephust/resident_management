package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.NewResidentDTO;
import management.resident_management.dto.ResidentDTO;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;
import management.resident_management.mapper.ResidentMapper;
import management.resident_management.repository.ResidentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
                resident.setBuilding(i % 2 == 0 ? "s1" : "s2");
                resident.setDepartment("A" + (i + 1));
                resident.setStatus("ACTIVE");
                residentRepository.save(resident);
            }
        }
    }

    public List<ResidentDTO> getAllResidents() {
        return residentRepository.findAll().stream()
                .map(ResidentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ResidentDTO getResidentById(Long id) {
        return residentRepository.findById(id)
                .map(ResidentMapper::toDTO)
                .orElse(null);
    }

    public ResidentDTO createResident(NewResidentDTO residentDTO) {
        Resident resident = ResidentMapper.toEntity(residentDTO);
        if (resident == null) {
            throw new IllegalArgumentException("Invalid resident data");
        }
        resident.setPassword(passwordEncoder.encode("password123"));
        resident.setCreatedAt(LocalDateTime.now());
        resident.setUpdatedAt(LocalDateTime.now());
        Resident savedResident = residentRepository.save(resident);
        return ResidentMapper.toDTO(savedResident);
    }

    public ResidentDTO updateResident(Long id, NewResidentDTO residentDTO) {
        Resident existingResident = residentRepository.findById(id).orElse(null);
        if (existingResident == null) {
            return null;
        }
        ResidentMapper.updateEntity(existingResident, residentDTO);
        existingResident.setUpdatedAt(LocalDateTime.now());
        Resident updatedResident = residentRepository.save(existingResident);
        return ResidentMapper.toDTO(updatedResident);
    }

    public void deleteResident(Long id) {
        residentRepository.deleteById(id);
    }

    public List<ResidentDTO> searchResidents(String searchTerm) {
        return residentRepository.findByNameContainingOrEmailContainingOrPhoneNumberContaining(
                        searchTerm, searchTerm, searchTerm).stream()
                .map(ResidentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ResidentDTO> getResidentsByStatus(String status) {
        return residentRepository.findByStatus(status).stream()
                .map(ResidentMapper::toDTO)
                .collect(Collectors.toList());
    }
}