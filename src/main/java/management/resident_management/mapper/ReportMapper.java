package management.resident_management.mapper;

import management.resident_management.dto.ReportDTO;
import management.resident_management.entity.Report;

public class ReportMapper {
    
    public static ReportDTO toDTO(Report report) {
        if (report == null) {
            return null;
        }

        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setType(report.getType());
        dto.setContent(report.getContent());
        dto.setCreatedAt(report.getCreatedAt() != null ? report.getCreatedAt().toString() : null);
        dto.setImageUrl(report.getImageUrl());
        dto.setStatus(report.getStatus());
        dto.setResponse(report.getResponse());
        
        if (report.getResident() != null) {
            dto.setResidentId(report.getResident().getId());
            dto.setResidentName(report.getResident().getName());
        }

        return dto;
    }
} 