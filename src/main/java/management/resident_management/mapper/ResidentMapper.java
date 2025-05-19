package management.resident_management.mapper;

import management.resident_management.dto.NewResidentDTO;
import management.resident_management.dto.ResidentDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;

public class ResidentMapper {

    public static ResidentDTO toDTO(Resident resident) {
        if (resident == null) {
            return null;
        }
        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setEmail(resident.getEmail());
        dto.setPhoneNumber(resident.getPhoneNumber());
        dto.setRole(resident.getRole() != null ? resident.getRole().name() : null);
        dto.setName(resident.getName());
        dto.setGender(resident.getGender());
        dto.setUnitNumber(resident.getUnitNumber());
        dto.setHometown(resident.getHometown());
        dto.setAddress(resident.getAddress());
        dto.setDescription(resident.getDescription());
        dto.setBirthday(resident.getBirthday());
        dto.setCreatedAt(resident.getCreatedAt());
        dto.setUpdatedAt(resident.getUpdatedAt());
        dto.setDeletedAt(resident.getDeletedAt());
        dto.setActive(resident.isActive());
        dto.setStripeCustomerId(resident.getStripeCustomerId());
        dto.setApartmentId(resident.getApartment() != null ? resident.getApartment().getId() : null);
        dto.setLeaseStartDate(resident.getLeaseStartDate());
        dto.setLeaseEndDate(resident.getLeaseEndDate());
        dto.setStatus(resident.getStatus());
        return dto;
    }

    public static Resident toEntity(NewResidentDTO dto) {
        if (dto == null) {
            return null;
        }
        Resident resident = Resident.builder()
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .name(dto.getName())
                .gender(dto.getGender())
                .unitNumber(dto.getUnitNumber())
                .hometown(dto.getHometown())
                .address(dto.getAddress())
                .description(dto.getDescription())
                .birthday(dto.getBirthday())
                .isActive(dto.isActive())
                .stripeCustomerId(dto.getStripeCustomerId())
                .leaseStartDate(dto.getLeaseStartDate())
                .leaseEndDate(dto.getLeaseEndDate())
                .status(dto.getStatus())
                .build();
        try {
            resident.setRole(UserRole.valueOf(dto.getRole()));
        } catch (IllegalArgumentException e) {
            resident.setRole(UserRole.RESIDENT);
        }
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        resident.setApartment(apartment);
        return resident;
    }

    public static void updateEntity(Resident resident, NewResidentDTO dto) {
        if (resident == null || dto == null) {
            return;
        }
        resident.setEmail(dto.getEmail());
        resident.setPhoneNumber(dto.getPhoneNumber());
        try {
            resident.setRole(UserRole.valueOf(dto.getRole()));
        } catch (IllegalArgumentException e) {
            resident.setRole(UserRole.RESIDENT);
        }
        resident.setName(dto.getName());
        resident.setGender(dto.getGender());
        resident.setUnitNumber(dto.getUnitNumber());
        resident.setHometown(dto.getHometown());
        resident.setAddress(dto.getAddress());
        resident.setDescription(dto.getDescription());
        resident.setBirthday(dto.getBirthday());
        resident.setActive(dto.isActive());
        resident.setStripeCustomerId(dto.getStripeCustomerId());
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        resident.setApartment(apartment);
        resident.setLeaseStartDate(dto.getLeaseStartDate());
        resident.setLeaseEndDate(dto.getLeaseEndDate());
        resident.setStatus(dto.getStatus());
    }
}