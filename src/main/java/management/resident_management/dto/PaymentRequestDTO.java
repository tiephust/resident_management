package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Fee ID is required")
    private Long feeId;
}