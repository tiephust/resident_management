package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.FeeTypeDTO;
import management.resident_management.dto.NewFeeTypeDTO;
import management.resident_management.entity.BillingCycle;
import management.resident_management.entity.FeeType;
import management.resident_management.mapper.FeeTypeMapper;
import management.resident_management.repository.FeeTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeTypeService {
    private final FeeTypeRepository feeTypeRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // Only initialize if no fee types exist
        if (feeTypeRepository.count() == 0) {
            // Define sample categories and units
            String[] categories = {"Utilities", "Maintenance", "Service"};
            String[] units = {"kWh", "m³", "Flat"};
            BillingCycle[] cycles = {BillingCycle.MONTHLY, BillingCycle.QUARTERLY, BillingCycle.YEARLY};

            // Create sample fee types
            for (int i = 0; i < 5; i++) {
                FeeType feeType = new FeeType();
                feeType.setName("Fee Type " + (i + 1));
                feeType.setCategory(categories[i % categories.length]);
                feeType.setUnit(units[i % units.length]);
                feeType.setPricePerUnit(10.0 * (i + 1));
                feeType.setBillingCycle(cycles[i % cycles.length]);
                feeType.setDescription("Description for Fee Type " + (i + 1));
                feeType.setIsActive(true);
                feeType.setCreatedAt(LocalDateTime.now());
                feeType.setUpdatedAt(LocalDateTime.now());
                feeTypeRepository.save(feeType);
            }
        }
    }

    public List<FeeTypeDTO> getAllFeeTypes() {
        return feeTypeRepository.findByIsActiveTrue().stream()
                .map(FeeTypeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FeeTypeDTO getFeeTypeById(Long id) {
        return feeTypeRepository.findById(id)
                .map(FeeTypeMapper::toDTO)
                .orElse(null);
    }

    public FeeTypeDTO createFeeType(NewFeeTypeDTO feeTypeDTO) {
        FeeType feeType = FeeTypeMapper.toEntity(feeTypeDTO);
        if (feeType == null) {
            throw new IllegalArgumentException("Invalid fee type data");
        }
        FeeType savedFeeType = feeTypeRepository.save(feeType);
        return FeeTypeMapper.toDTO(savedFeeType);
    }

    public FeeTypeDTO updateFeeType(Long id, NewFeeTypeDTO feeTypeDTO) {
        FeeType existingFeeType = feeTypeRepository.findById(id).orElse(null);
        if (existingFeeType == null) {
            return null;
        }
        FeeTypeMapper.updateEntity(existingFeeType, feeTypeDTO);
        FeeType updatedFeeType = feeTypeRepository.save(existingFeeType);
        return FeeTypeMapper.toDTO(updatedFeeType);
    }

    public void deleteFeeType(Long id) {
        FeeType feeType = feeTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee type not found"));
        feeType.setIsActive(false);
        feeTypeRepository.save(feeType);
    }

    public List<FeeTypeDTO> searchFeeTypes(String searchTerm) {
        return feeTypeRepository.findByNameContainingOrDescriptionContaining(searchTerm, searchTerm).stream()
                .map(FeeTypeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FeeTypeDTO> getFeeTypesByCategory(String category) {
        return feeTypeRepository.findByCategory(category).stream()
                .map(FeeTypeMapper::toDTO)
                .collect(Collectors.toList());
    }
}