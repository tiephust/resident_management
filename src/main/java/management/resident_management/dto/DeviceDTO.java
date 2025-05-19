package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeviceDTO {
    private Long id;
    private String name;
    private Long apartmentId;
    private String type;
    private String numberCard;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime maintenanceAt;
    private String status;
}