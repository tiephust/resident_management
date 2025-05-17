package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.entity.FeeType;
import management.resident_management.repository.FeeTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeTypeService {
    private final FeeTypeRepository feeTypeRepository;

    @PostConstruct
    @Transactional
    public void init() {
        if (feeTypeRepository.count() == 0) {
            // Initialize with some default fee types
            FeeType waterFee = new FeeType();
            waterFee.setName("Tiền nước");
            waterFee.setCategory("Dịch vụ cơ bản");
            waterFee.setUnit("m³");
            waterFee.setPricePerUnit(15000.0);
            waterFee.setBillingCycle("Hàng tháng");
            waterFee.setDescription("Phí sử dụng nước sinh hoạt");
            waterFee.setIsActive(true);
            waterFee.setCreatedAt(LocalDateTime.now());
            waterFee.setUpdatedAt(LocalDateTime.now());
            feeTypeRepository.save(waterFee);

            FeeType electricityFee = new FeeType();
            electricityFee.setName("Tiền điện");
            electricityFee.setCategory("Dịch vụ cơ bản");
            electricityFee.setUnit("kWh");
            electricityFee.setPricePerUnit(3500.0);
            electricityFee.setBillingCycle("Hàng tháng");
            electricityFee.setDescription("Phí sử dụng điện");
            electricityFee.setIsActive(true);
            electricityFee.setCreatedAt(LocalDateTime.now());
            electricityFee.setUpdatedAt(LocalDateTime.now());
            feeTypeRepository.save(electricityFee);
        }
    }

    public List<FeeType> getAllFeeTypes() {
        return feeTypeRepository.findAll();
    }

    public FeeType getFeeTypeById(Long id) {
        return feeTypeRepository.findById(id).orElse(null);
    }

    public FeeType createFeeType(FeeType feeType) {
        feeType.setCreatedAt(LocalDateTime.now());
        feeType.setUpdatedAt(LocalDateTime.now());
        return feeTypeRepository.save(feeType);
    }

    public FeeType updateFeeType(Long id, FeeType feeType) {
        FeeType existingFeeType = feeTypeRepository.findById(id).orElse(null);
        if (existingFeeType != null) {
            existingFeeType.setName(feeType.getName());
            existingFeeType.setCategory(feeType.getCategory());
            existingFeeType.setUnit(feeType.getUnit());
            existingFeeType.setPricePerUnit(feeType.getPricePerUnit());
            existingFeeType.setBillingCycle(feeType.getBillingCycle());
            existingFeeType.setDescription(feeType.getDescription());
            existingFeeType.setIsActive(feeType.getIsActive());
            existingFeeType.setUpdatedAt(LocalDateTime.now());
            return feeTypeRepository.save(existingFeeType);
        }
        return null;
    }

    public void deleteFeeType(Long id) {
        feeTypeRepository.deleteById(id);
    }

    public List<FeeType> searchFeeTypes(String searchTerm) {
        return feeTypeRepository.findByNameContainingOrCategoryContaining(searchTerm, searchTerm);
    }

    public List<FeeType> getFeeTypesByCategory(String category) {
        return feeTypeRepository.findByCategory(category);
    }
} 