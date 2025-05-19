package management.resident_management.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ApartmentDTO {
    private Long id;
    private List<Long> feeIds;
    private List<Long> residentIds;
    private List<Long> deviceIds;
    private String name;
    private Long apartmentOwnerId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}