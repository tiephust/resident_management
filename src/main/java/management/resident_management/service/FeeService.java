package management.resident_management.service;

import management.resident_management.dto.FeeDTO;
import management.resident_management.entity.Fee;
import management.resident_management.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;

    public List<FeeDTO> getAllFees() {
        return feeRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public FeeDTO getFeeById(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found with id: " + id));
        return convertToDTO(fee);
    }

    public FeeDTO createFee(Fee fee) {
        Fee savedFee = feeRepository.save(fee);
        return convertToDTO(savedFee);
    }

    public FeeDTO updateFee(Long id, Fee fee) {
        Fee existingFee = feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found with id: " + id));
        existingFee.setResident(fee.getResident());
        existingFee.setFeeType(fee.getFeeType());
        existingFee.setAmount(fee.getAmount());
        existingFee.setDueDate(fee.getDueDate());
        existingFee.setPaymentDate(fee.getPaymentDate());
        existingFee.setStatus(fee.getStatus());
        existingFee.setDescription(fee.getDescription());
        Fee updatedFee = feeRepository.save(existingFee);
        return convertToDTO(updatedFee);
    }

    public void deleteFee(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found with id: " + id));
        feeRepository.delete(fee);
    }

    public List<FeeDTO> searchFees(String searchTerm) {
        return feeRepository.findByDescriptionContainingIgnoreCase(searchTerm)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<FeeDTO> getFeesByStatus(String status) {
        return feeRepository.findByStatus(Fee.FeeStatus.valueOf(status.toUpperCase()))
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<FeeDTO> getFeesByResident(Long residentId) {
        return feeRepository.findByResidentId(residentId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private FeeDTO convertToDTO(Fee fee) {
        FeeDTO dto = new FeeDTO();
        dto.setId(fee.getId());
        dto.setAmount(fee.getAmount());
        dto.setDueDate(fee.getDueDate());
        dto.setPaymentDate(fee.getPaymentDate());
        dto.setStatus(fee.getStatus().name());
        dto.setDescription(fee.getDescription());
        dto.setCreatedAt(fee.getCreatedAt());
        dto.setUpdatedAt(fee.getUpdatedAt());

        FeeDTO.ResidentDTO residentDTO = new FeeDTO.ResidentDTO();
        residentDTO.setId(fee.getResident().getId());
        residentDTO.setName(fee.getResident().getName());
        dto.setResident(residentDTO);

        FeeDTO.FeeTypeDTO feeTypeDTO = new FeeDTO.FeeTypeDTO();
        feeTypeDTO.setId(fee.getFeeType().getId());
        feeTypeDTO.setName(fee.getFeeType().getName());
        feeTypeDTO.setCategory(fee.getFeeType().getCategory());
        feeTypeDTO.setUnit(fee.getFeeType().getUnit());
        feeTypeDTO.setPricePerUnit(fee.getFeeType().getPricePerUnit());
        dto.setFeeType(feeTypeDTO);

        return dto;
    }
}