package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
public class NewDeviceDTO {
    @NotBlank(message = "Name is required")
    private String name;

//    @NotNull(message = "Apartment ID is required")
    private Long apartmentId;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Number card is required")
    private String numberCard;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Maintenance date is required")
    private LocalDateTime maintenanceAt;
}