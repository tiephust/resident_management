package management.resident_management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewResidentDTO {
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

    @Pattern(regexp = "^(s1|s2)?$", message = "Building must be 's1', 's2', or empty")
    private String building;
}