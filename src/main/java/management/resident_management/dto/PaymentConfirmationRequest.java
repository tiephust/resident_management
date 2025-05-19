package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class PaymentConfirmationRequest {
    @NotBlank(message = "Fee ID is required")
    private String feeId;

    @NotBlank(message = "Stripe Payment ID is required")
    private String stripePaymentId;
}