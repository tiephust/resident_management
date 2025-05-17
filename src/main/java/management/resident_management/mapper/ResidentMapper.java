package management.resident_management.mapper;

import management.resident_management.dto.NewResidentDTO;
import management.resident_management.dto.ResidentDTO;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;

import java.time.LocalDate;

public class ResidentMapper {

    public static ResidentDTO toDTO(Resident resident) {
        if (resident == null) {
            return null;
        }

        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setName(resident.getName());
        dto.setEmail(resident.getEmail());
        dto.setPhoneNumber(resident.getPhoneNumber());
        dto.setUnitNumber(resident.getUnitNumber());
        dto.setDepartment(resident.getDepartment());
        dto.setLeaseStartDate(resident.getLeaseStartDate() != null ? resident.getLeaseStartDate().toString() : null);
        dto.setLeaseEndDate(resident.getLeaseEndDate() != null ? resident.getLeaseEndDate().toString() : null);
        dto.setRole(resident.getRole() != null ? resident.getRole().toString() : null);
        dto.setGender(resident.getGender());
        dto.setHometown(resident.getHometown());
        dto.setAddress(resident.getAddress());
        dto.setDescription(resident.getDescription());
        dto.setBirthday(resident.getBirthday() != null ? resident.getBirthday().toString() : null);
        dto.setStripeCustomerId(resident.getStripeCustomerId());
        dto.setStatus(resident.getStatus());
        dto.setActive(resident.isActive());
        dto.setCreatedAt(resident.getCreatedAt() != null ? resident.getCreatedAt().toString() : null);
        dto.setUpdatedAt(resident.getUpdatedAt() != null ? resident.getUpdatedAt().toString() : null);
        dto.setDeletedAt(resident.getDeletedAt() != null ? resident.getDeletedAt().toString() : null);
        dto.setBuilding(resident.getBuilding());

        return dto;
    }

    public static Resident toEntity(NewResidentDTO dto) {
        if (dto == null) {
            return null;
        }

        Resident resident = new Resident();
        resident.setName(dto.getName());
        resident.setEmail(dto.getEmail());
        resident.setPhoneNumber(dto.getPhoneNumber());
        resident.setUnitNumber(dto.getUnitNumber());
        resident.setDepartment(dto.getDepartment());
        resident.setLeaseStartDate(parseDate(dto.getLeaseStartDate()));
        resident.setLeaseEndDate(parseDate(dto.getLeaseEndDate()));
        resident.setRole(dto.getRole() != null ? Enum.valueOf(UserRole.class, dto.getRole()) : UserRole.RESIDENT);
        resident.setGender(dto.getGender());
        resident.setHometown(dto.getHometown());
        resident.setAddress(dto.getAddress());
        resident.setDescription(dto.getDescription());
        resident.setBirthday(parseDate(dto.getBirthday()));
        resident.setStripeCustomerId(dto.getStripeCustomerId());
        resident.setStatus(dto.getStatus());
        resident.setActive(dto.isActive());
        resident.setBuilding(dto.getBuilding());

        return resident;
    }

    public static void updateEntity(Resident resident, NewResidentDTO dto) {
        if (resident == null || dto == null) {
            return;
        }

        resident.setName(dto.getName());
        resident.setEmail(dto.getEmail());
        resident.setPhoneNumber(dto.getPhoneNumber());
        resident.setUnitNumber(dto.getUnitNumber());
        resident.setDepartment(dto.getDepartment());
        resident.setLeaseStartDate(parseDate(dto.getLeaseStartDate()));
        resident.setLeaseEndDate(parseDate(dto.getLeaseEndDate()));
        resident.setRole(dto.getRole() != null ? Enum.valueOf(UserRole.class, dto.getRole()) : UserRole.RESIDENT);
        resident.setGender(dto.getGender());
        resident.setHometown(dto.getHometown());
        resident.setAddress(dto.getAddress());
        resident.setDescription(dto.getDescription());
        resident.setBirthday(parseDate(dto.getBirthday()));
        resident.setStripeCustomerId(dto.getStripeCustomerId());
        resident.setStatus(dto.getStatus());
        resident.setActive(dto.isActive());
        resident.setBuilding(dto.getBuilding());
    }

    private static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDate.parse(dateStr);
    }
}