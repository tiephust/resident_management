package management.resident_management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResidentDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Unit number is required")
    private String unitNumber;

    private String department;

    @Pattern(regexp = "^$|^\\d{4}-\\d{2}-\\d{2}$", message = "Lease start date must be in YYYY-MM-DD format or empty")
    private String leaseStartDate;

    @Pattern(regexp = "^$|^\\d{4}-\\d{2}-\\d{2}$", message = "Lease end date must be in YYYY-MM-DD format or empty")
    private String leaseEndDate;

    private String role;

    private String gender;

    private String hometown;

    private String address;

    private String description;

    @Pattern(regexp = "^$|^\\d{4}-\\d{2}-\\d{2}$", message = "Birthday must be in YYYY-MM-DD format or empty")
    private String birthday;

    private String stripeCustomerId;

    private String status;

    private boolean isActive;

    private String createdAt;      // ISO date-time string (e.g., "2025-05-17T20:24:26.319224")
    private String updatedAt;      // ISO date-time string
    private String deletedAt;

    @Pattern(regexp = "^(s1|s2)?$", message = "Building must be 's1', 's2', or empty")
    private String building;
}