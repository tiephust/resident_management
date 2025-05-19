package management.resident_management.mapper;

import management.resident_management.dto.FeeTypeDTO;
import management.resident_management.dto.NewFeeTypeDTO;
import management.resident_management.entity.BillingCycle;
import management.resident_management.entity.FeeType;

public class FeeTypeMapper {

    public static FeeTypeDTO toDTO(FeeType feeType) {
        if (feeType == null) {
            return null;
        }
        FeeTypeDTO dto = new FeeTypeDTO();
        dto.setId(feeType.getId());
        dto.setName(feeType.getName());
        dto.setCategory(feeType.getCategory());
        dto.setUnit(feeType.getUnit());
        dto.setPricePerUnit(feeType.getPricePerUnit());
        dto.setBillingCycle(feeType.getBillingCycle() != null ? feeType.getBillingCycle().name() : null);
        dto.setDescription(feeType.getDescription());
        dto.setIsActive(feeType.getIsActive());
        dto.setCreatedAt(feeType.getCreatedAt());
        dto.setUpdatedAt(feeType.getUpdatedAt());
        return dto;
    }

    public static FeeType toEntity(NewFeeTypeDTO dto) {
        if (dto == null) {
            return null;
        }
        FeeType feeType = new FeeType();
        feeType.setName(dto.getName());
        feeType.setCategory(dto.getCategory());
        feeType.setUnit(dto.getUnit());
        feeType.setPricePerUnit(dto.getPricePerUnit());
        try {
            feeType.setBillingCycle(BillingCycle.valueOf(dto.getBillingCycle()));
        } catch (IllegalArgumentException e) {
            feeType.setBillingCycle(BillingCycle.MONTHLY); // Default to MONTHLY if invalid
        }
        feeType.setDescription(dto.getDescription());
        feeType.setIsActive(dto.getIsActive());
        return feeType;
    }

    public static void updateEntity(FeeType feeType, NewFeeTypeDTO dto) {
        if (feeType == null || dto == null) {
            return;
        }
        feeType.setName(dto.getName());
        feeType.setCategory(dto.getCategory());
        feeType.setUnit(dto.getUnit());
        feeType.setPricePerUnit(dto.getPricePerUnit());
        try {
            feeType.setBillingCycle(BillingCycle.valueOf(dto.getBillingCycle()));
        } catch (IllegalArgumentException e) {
            feeType.setBillingCycle(BillingCycle.MONTHLY); // Default to MONTHLY if invalid
        }
        feeType.setDescription(dto.getDescription());
        feeType.setIsActive(dto.getIsActive());
    }
}