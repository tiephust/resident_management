package management.resident_management.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.FeeDTO;
import management.resident_management.dto.NewFeeDTO;
import management.resident_management.dto.PaymentRequestDTO;
import management.resident_management.dto.RefundRequestDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Fee;
import management.resident_management.entity.FeeStatus;
import management.resident_management.entity.FeeType;
import management.resident_management.mapper.FeeMapper;
import management.resident_management.repository.ApartmentRepository;
import management.resident_management.repository.FeeRepository;
import management.resident_management.repository.FeeTypeRepository;
import management.resident_management.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeService {
    private final FeeRepository feeRepository;
    private final ApartmentRepository apartmentRepository;
    private final FeeTypeRepository feeTypeRepository;
    private final ResidentRepository residentRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    @Transactional
    public void init() {
//        Stripe.apiKey = stripeApiKey;
//        if (feeRepository.count() == 0) {
//            List<Long> residentIds = residentRepository.findAll().stream()
//                    .map(resident -> resident.getId())
//                    .collect(Collectors.toList());
//            for (int i = 0; i < 10; i++) {
//                Fee fee = new Fee();
//                Apartment apartment = apartmentRepository.findById((long) ((i % 5) + 1)).orElse(null);
//                fee.setApartment(apartment);
//                FeeType feeType = feeTypeRepository.findById((long) ((i % 3) + 1)).orElse(new FeeType());
//                fee.setFeeType(feeType);
//                fee.setResidentId(residentIds.isEmpty() ? null : residentIds.get(i % residentIds.size()));
//                fee.setAmount(100.0 * (i + 1));
//                fee.setDueDate(LocalDate.now().plusDays(30));
//                fee.setDescription("Monthly Fee " + (i + 1));
//                fee.setStatus(FeeStatus.UNPAID);
//                fee.setCreatedAt(LocalDateTime.now());
//                fee.setUpdatedAt(LocalDateTime.now());
//                feeRepository.save(fee);
//            }
//        }
    }

    public List<FeeDTO> getAllFees() {
        return feeRepository.findAll().stream()
                .map(FeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FeeDTO getFeeById(Long id) {
        return feeRepository.findById(id)
                .map(FeeMapper::toDTO)
                .orElse(null);
    }

    public List<FeeDTO> getFeesByApartment(Long apartmentId) {
        return feeRepository.findByApartmentId(apartmentId).stream()
                .map(FeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeeDTO createFee(NewFeeDTO feeDTO) {
        Fee fee = FeeMapper.toEntity(feeDTO);
        if (fee == null) {
            throw new IllegalArgumentException("Invalid fee data");
        }
        Apartment apartment = apartmentRepository.findById(feeDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        fee.setApartment(apartment);
        FeeType feeType = feeTypeRepository.findById(feeDTO.getFeeTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Fee Type not found"));
        fee.setFeeType(feeType);
        if (feeDTO.getResidentId() != null) {
            residentRepository.findById(feeDTO.getResidentId())
                    .orElseThrow(() -> new IllegalArgumentException("Resident not found"));
        }
        fee.setCreatedAt(LocalDateTime.now());
        fee.setUpdatedAt(LocalDateTime.now());
        Fee savedFee = feeRepository.save(fee);
        return FeeMapper.toDTO(savedFee);
    }

    @Transactional
    public FeeDTO updateFee(Long id, NewFeeDTO feeDTO) {
        Fee existingFee = feeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));
        FeeMapper.updateEntity(existingFee, feeDTO);
        Apartment apartment = apartmentRepository.findById(feeDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        existingFee.setApartment(apartment);
        FeeType feeType = feeTypeRepository.findById(feeDTO.getFeeTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Fee Type not found"));
        existingFee.setFeeType(feeType);
        if (feeDTO.getResidentId() != null) {
            residentRepository.findById(feeDTO.getResidentId())
                    .orElseThrow(() -> new IllegalArgumentException("Resident not found"));
        }
        existingFee.setUpdatedAt(LocalDateTime.now());
        Fee updatedFee = feeRepository.save(existingFee);
        return FeeMapper.toDTO(updatedFee);
    }

    @Transactional
    public void deleteFee(Long id) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));
        feeRepository.delete(fee);
    }

    public List<FeeDTO> searchFees(String searchTerm) {
        return feeRepository.findByDescriptionContaining(searchTerm).stream()
                .map(FeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FeeDTO> getFees(String status, Long residentId) {
        if ("ALL".equalsIgnoreCase(status) && residentId == null) {
            return getAllFees();
        } else if ("ALL".equalsIgnoreCase(status)) {
            return feeRepository.findByResidentId(residentId).stream()
                    .map(FeeMapper::toDTO)
                    .collect(Collectors.toList());
        } else if (residentId == null) {
            return feeRepository.findByStatus(FeeStatus.valueOf(status)).stream()
                    .map(FeeMapper::toDTO)
                    .collect(Collectors.toList());
        } else {
            return feeRepository.findByStatusAndResidentId(FeeStatus.valueOf(status), residentId).stream()
                    .map(FeeMapper::toDTO)
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public FeeDTO createPaymentIntent(PaymentRequestDTO request) throws StripeException {
        Fee fee = feeRepository.findById(request.getFeeId())
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));
        if (fee.getStatus() != FeeStatus.UNPAID) {
            throw new IllegalStateException("Fee is not in UNPAID status");
        }
        PaymentIntent paymentIntent = PaymentIntent.create(
                PaymentIntentCreateParams.builder()
                        .setAmount((long) (fee.getAmount() * 100)) // Convert to cents
                        .setCurrency("usd")
                        .setDescription(fee.getDescription())
                        .putMetadata("feeId", fee.getId().toString()) // Correct way to set metadata
                        .build()
        );
        fee.setStripePaymentIntentId(paymentIntent.getId());
        fee.setStripePaymentStatus(paymentIntent.getStatus());
        fee.setStatus(FeeStatus.PROCESSING);
        fee.setUpdatedAt(LocalDateTime.now());
        Fee savedFee = feeRepository.save(fee);
        return FeeMapper.toDTO(savedFee);
    }

    @Transactional
    public FeeDTO confirmPayment(Long feeId, String stripePaymentId, Long residentId) throws StripeException {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));
        residentRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));
        PaymentIntent paymentIntent = PaymentIntent.retrieve(stripePaymentId);
        if ("succeeded".equals(paymentIntent.getStatus())) {
            fee.setStatus(FeeStatus.PAID);
            fee.setStripePaymentStatus(paymentIntent.getStatus());
            fee.setPaymentDate(LocalDate.now());
            fee.setResidentId(residentId);
            fee.setUpdatedAt(LocalDateTime.now());
            Fee savedFee = feeRepository.save(fee);
            return FeeMapper.toDTO(savedFee);
        } else {
            throw new IllegalStateException("Payment not successful");
        }
    }

    @Transactional
    public FeeDTO processRefund(RefundRequestDTO request) throws StripeException {
        Fee fee = feeRepository.findById(request.getFeeId())
                .orElseThrow(() -> new IllegalArgumentException("Fee not found"));
        if (fee.getStatus() != FeeStatus.PAID) {
            throw new IllegalStateException("Fee is not in PAID status");
        }
        Refund refund = Refund.create(
                RefundCreateParams.builder()
                        .setPaymentIntent(fee.getStripePaymentIntentId())
                        .setReason(RefundCreateParams.Reason.valueOf(request.getReason()))
                        .build()
        );
        fee.setStatus(FeeStatus.REFUNDED);
        fee.setStripePaymentStatus("refunded");
        fee.setUpdatedAt(LocalDateTime.now());
        Fee savedFee = feeRepository.save(fee);
        return FeeMapper.toDTO(savedFee);
    }
}