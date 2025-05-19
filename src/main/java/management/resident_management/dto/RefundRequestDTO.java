package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class RefundRequestDTO {
    private Long feeId;

    @NotBlank(message = "Reason is required")
    private String reason;
}