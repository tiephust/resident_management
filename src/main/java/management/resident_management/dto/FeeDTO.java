package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FeeDTO {
    private Long id;
    private Long apartmentId;
    private Long feeTypeId;
    private Long residentId;
    private Double amount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private String status;
    private String description;
    private String stripePaymentIntentId;
    private String stripePaymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}