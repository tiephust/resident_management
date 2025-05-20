package management.resident_management.dto;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class NewResidentDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Name is required")
    private String name;

    private String gender;

    @NotBlank(message = "Unit number is required")
    private String unitNumber;

    private String hometown;

    private String address;

    private String description;

    private LocalDate birthday;

    @NotNull(message = "Active status is required")
    private boolean isActive;

    private String stripeCustomerId;

    @NotNull(message = "Apartment ID is required")
    private Long apartmentId;

    @NotNull(message = "Lease start date is required")
    private LocalDate leaseStartDate;

    private LocalDate leaseEndDate;

//    @NotBlank(message = "Status is required")
    private String status;
}