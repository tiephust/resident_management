package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FeeDTO {
    private Long id;
    private ResidentDTO resident;
    private FeeTypeDTO feeType;
    private Double amount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class ResidentDTO {
        private Long id;
        private String name;
    }

    @Data
    public static class FeeTypeDTO {
        private Long id;
        private String name;
        private String category;
        private String unit;
        private Double pricePerUnit;
    }
}