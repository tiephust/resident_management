package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ResidentDTO {
    private Long id;
    private String email;
    private String phoneNumber;
    private String role;
    private String name;
    private String gender;
    private String unitNumber;
    private String hometown;
    private String address;
    private String description;
    private LocalDate birthday;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private boolean isActive;
    private String stripeCustomerId;
    private Long apartmentId;
    private LocalDate leaseStartDate;
    private LocalDate leaseEndDate;
    private String status;
}