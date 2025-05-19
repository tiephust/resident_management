package management.resident_management.mapper;

import management.resident_management.dto.FeeDTO;
import management.resident_management.dto.NewFeeDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Fee;
import management.resident_management.entity.FeeStatus;
import management.resident_management.entity.FeeType;

public class FeeMapper {

    public static FeeDTO toDTO(Fee fee) {
        if (fee == null) {
            return null;
        }
        FeeDTO dto = new FeeDTO();
        dto.setId(fee.getId());
        dto.setApartmentId(fee.getApartment() != null ? fee.getApartment().getId() : null);
        dto.setFeeTypeId(fee.getFeeType() != null ? fee.getFeeType().getId() : null);
        dto.setResidentId(fee.getResidentId());
        dto.setAmount(fee.getAmount());
        dto.setDueDate(fee.getDueDate());
        dto.setPaymentDate(fee.getPaymentDate());
        dto.setStatus(fee.getStatus() != null ? fee.getStatus().name() : null);
        dto.setDescription(fee.getDescription());
        dto.setStripePaymentIntentId(fee.getStripePaymentIntentId());
        dto.setStripePaymentStatus(fee.getStripePaymentStatus());
        dto.setCreatedAt(fee.getCreatedAt());
        dto.setUpdatedAt(fee.getUpdatedAt());
        return dto;
    }

    public static Fee toEntity(NewFeeDTO dto) {
        if (dto == null) {
            return null;
        }
        Fee fee = new Fee();
        fee.setAmount(dto.getAmount());
        fee.setDueDate(dto.getDueDate());
        fee.setDescription(dto.getDescription());
        fee.setResidentId(dto.getResidentId());
        try {
            fee.setStatus(FeeStatus.valueOf(dto.getStatus()));
        } catch (IllegalArgumentException e) {
            fee.setStatus(FeeStatus.UNPAID);
        }
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        fee.setApartment(apartment);
        FeeType feeType = new FeeType();
        feeType.setId(dto.getFeeTypeId());
        fee.setFeeType(feeType);
        return fee;
    }

    public static void updateEntity(Fee fee, NewFeeDTO dto) {
        if (fee == null || dto == null) {
            return;
        }
        fee.setAmount(dto.getAmount());
        fee.setDueDate(dto.getDueDate());
        fee.setDescription(dto.getDescription());
        fee.setResidentId(dto.getResidentId());
        try {
            fee.setStatus(FeeStatus.valueOf(dto.getStatus()));
        } catch (IllegalArgumentException e) {
            fee.setStatus(FeeStatus.UNPAID);
        }
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        fee.setApartment(apartment);
        FeeType feeType = new FeeType();
        feeType.setId(dto.getFeeTypeId());
        fee.setFeeType(feeType);
    }
}