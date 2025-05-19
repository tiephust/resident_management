package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeeTypeDTO {
    private Long id;
    private String name;
    private String category;
    private String unit;
    private Double pricePerUnit;
    private String billingCycle;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}