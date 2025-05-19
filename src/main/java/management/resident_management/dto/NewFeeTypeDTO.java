package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class NewFeeTypeDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price per unit must be positive")
    private Double pricePerUnit;

    @NotBlank(message = "Billing cycle is required")
    private String billingCycle;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Active status is required")
    private Boolean isActive;
}