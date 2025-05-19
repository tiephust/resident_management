package management.resident_management.dto;

import lombok.Data;
import management.resident_management.entity.Report.ReportStatus;

import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private Long id;
    private String type;
    private String content;
    private String createdAt;
    private String imageUrl;
    private ReportStatus status;
    private String response;
    private Long residentId;
    private String residentName;
} 