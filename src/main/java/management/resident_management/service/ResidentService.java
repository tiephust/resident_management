package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.NewResidentDTO;
import management.resident_management.dto.ResidentDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;
import management.resident_management.mapper.ResidentMapper;
import management.resident_management.repository.ApartmentRepository;
import management.resident_management.repository.ResidentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResidentService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        if (residentRepository.count() == 0) {
            for (int i = 0; i < 10; i++) {
                Resident resident = Resident.builder()
                        .email("resident" + (i + 1) + "@example.com")
                        .password(passwordEncoder.encode("password123"))
                        .phoneNumber("555-010" + i)
                        .role(UserRole.RESIDENT)
                        .name("Resident " + (i + 1))
                        .gender(i % 2 == 0 ? "MALE" : "FEMALE")
                        .unitNumber("Unit " + (i + 1))
                        .hometown("Hometown " + (i + 1))
                        .address("Address " + (i + 1))
                        .description("Description for Resident " + (i + 1))
                        .birthday(LocalDate.now().minusYears(20 + i))
                        .isActive(true)
                        .stripeCustomerId("cus_" + (i + 1))
                        .leaseStartDate(LocalDate.now().minusMonths(6))
                        .leaseEndDate(LocalDate.now().plusMonths(6))
                        .status("ACTIVE")
                        .build();
                Apartment apartment = apartmentRepository.findById((long) ((i % 5) + 1)).orElse(null);
                resident.setApartment(apartment);
                resident.setCreatedAt(LocalDateTime.now());
                resident.setUpdatedAt(LocalDateTime.now());
                residentRepository.save(resident);
            }
        }
    }

    public List<ResidentDTO> getAllResidents() {
        return residentRepository.findAll().stream()
                .filter(resident -> resident.getDeletedAt() == null)
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
        Apartment apartment = apartmentRepository.findById(residentDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        resident.setApartment(apartment);
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
        Apartment apartment = apartmentRepository.findById(residentDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        existingResident.setApartment(apartment);
        existingResident.setUpdatedAt(LocalDateTime.now());
        Resident updatedResident = residentRepository.save(existingResident);
        return ResidentMapper.toDTO(updatedResident);
    }

    public void deleteResident(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));
        resident.setActive(false);
        resident.setDeletedAt(LocalDateTime.now());
        residentRepository.save(resident);
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

    public List<ResidentDTO> getResidentsByUnitNumber(String unitNumber) {
        return residentRepository.findByUnitNumber(unitNumber).stream()
                .map(ResidentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ResidentDTO> getResidentsByApartmentId(Long apartmentId) {
        return residentRepository.findByApartmentId(apartmentId).stream()
                .map(ResidentMapper::toDTO)
                .collect(Collectors.toList());
    }
}