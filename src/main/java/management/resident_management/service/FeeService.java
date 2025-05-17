package management.resident_management.service;

import management.resident_management.entity.Fee;
import management.resident_management.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;

    public List<Fee> getAllFees() {
        return feeRepository.findAll();
    }

    public Fee getFeeById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee not found with id: " + id));
    }

    public Fee createFee(Fee fee) {
        return feeRepository.save(fee);
    }

    public Fee updateFee(Long id, Fee fee) {
        Fee existingFee = getFeeById(id);
        existingFee.setResident(fee.getResident());
        existingFee.setFeeType(fee.getFeeType());
        existingFee.setAmount(fee.getAmount());
        existingFee.setDueDate(fee.getDueDate());
        existingFee.setPaymentDate(fee.getPaymentDate());
        existingFee.setStatus(fee.getStatus());
        existingFee.setDescription(fee.getDescription());
        return feeRepository.save(existingFee);
    }

    public void deleteFee(Long id) {
        Fee fee = getFeeById(id);
        feeRepository.delete(fee);
    }

    public List<Fee> searchFees(String searchTerm) {
        return feeRepository.findByDescriptionContainingIgnoreCase(searchTerm);
    }

    public List<Fee> getFeesByStatus(String status) {
        return feeRepository.findByStatus(Fee.FeeStatus.valueOf(status.toUpperCase()));
    }

    public List<Fee> getFeesByResident(Long residentId) {
        return feeRepository.findByResidentId(residentId);
    }
}