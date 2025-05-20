package management.resident_management.dto;

import lombok.Data;
import management.resident_management.entity.FormState;
import java.time.LocalDateTime;

@Data
public class AbsentFormDTO {
    // Getters and Setters
    private Long id;
    private Long residentId;
    private String residentName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String reason;
    private FormState state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
