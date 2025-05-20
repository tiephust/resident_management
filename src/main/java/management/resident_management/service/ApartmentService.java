package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.ApartmentDTO;
import management.resident_management.dto.NewApartmentDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.mapper.ApartmentMapper;
import management.resident_management.repository.ApartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApartmentService {
    private final ApartmentRepository apartmentRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // Only initialize if no apartments exist
        if (apartmentRepository.count() == 0) {
            // Create sample apartments
            for (int i = 0; i < 10; i++) {
                Apartment apartment = new Apartment();
                apartment.setName("Apartment " + (i + 1));
                apartment.setApartmentOwnerId((long) (i + 1));
                apartment.setDescription("Description for Apartment " + (i + 1));
                apartment.setCreatedAt(LocalDateTime.now());
                apartment.setUpdatedAt(LocalDateTime.now());
                apartmentRepository.save(apartment);
            }
        }
    }

    public List<ApartmentDTO> getAllApartments() {
        return apartmentRepository.findAll().stream()
                .map(ApartmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ApartmentDTO getApartmentById(Long id) {
        return apartmentRepository.findById(id)
                .map(ApartmentMapper::toDTO)
                .orElse(null);
    }

    public ApartmentDTO createApartment(NewApartmentDTO apartmentDTO) {
        Apartment apartment = ApartmentMapper.toEntity(apartmentDTO);
        if (apartment == null) {
            throw new IllegalArgumentException("Invalid apartment data");
        }
        apartment.setCreatedAt(LocalDateTime.now());
        apartment.setUpdatedAt(LocalDateTime.now());
        Apartment savedApartment = apartmentRepository.save(apartment);
        return ApartmentMapper.toDTO(savedApartment);
    }

    public ApartmentDTO updateApartment(Long id, NewApartmentDTO apartmentDTO) {
        Apartment existingApartment = apartmentRepository.findById(id).orElse(null);
        if (existingApartment == null) {
            return null;
        }
        ApartmentMapper.updateEntity(existingApartment, apartmentDTO);
        existingApartment.setUpdatedAt(LocalDateTime.now());
        Apartment updatedApartment = apartmentRepository.save(existingApartment);
        return ApartmentMapper.toDTO(updatedApartment);
    }

    public void deleteApartment(Long id) {
        apartmentRepository.deleteById(id);
    }

    public List<ApartmentDTO> searchApartments(String searchTerm) {
        return apartmentRepository.findByNameContainingOrDescriptionContaining(searchTerm, searchTerm).stream()
                .map(ApartmentMapper::toDTO)
                .collect(Collectors.toList());
    }
}