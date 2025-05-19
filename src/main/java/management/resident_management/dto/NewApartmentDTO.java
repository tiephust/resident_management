package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class NewApartmentDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private Long apartmentOwnerId;
}