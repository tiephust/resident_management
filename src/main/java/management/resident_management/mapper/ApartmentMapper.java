package management.resident_management.mapper;

import management.resident_management.dto.ApartmentDTO;
import management.resident_management.dto.NewApartmentDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Device;
import management.resident_management.entity.Fee;
import management.resident_management.entity.Resident;

import java.util.stream.Collectors;

public class ApartmentMapper {

    public static ApartmentDTO toDTO(Apartment apartment) {
        if (apartment == null) {
            return null;
        }
        ApartmentDTO dto = new ApartmentDTO();
        dto.setId(apartment.getId());
        dto.setFeeIds(apartment.getFees() != null ? apartment.getFees().stream().map(Fee::getId).collect(Collectors.toList()) : null);
        dto.setResidentIds(apartment.getResidents() != null ? apartment.getResidents().stream().map(Resident::getId).collect(Collectors.toList()) : null);
        dto.setDeviceIds(apartment.getDevices() != null ? apartment.getDevices().stream().map(Device::getId).collect(Collectors.toList()) : null);
        dto.setName(apartment.getName());
        dto.setApartmentOwnerId(apartment.getApartmentOwnerId());
        dto.setDescription(apartment.getDescription());
        dto.setCreatedAt(apartment.getCreatedAt());
        dto.setUpdatedAt(apartment.getUpdatedAt());
        return dto;
    }

    public static Apartment toEntity(NewApartmentDTO dto) {
        if (dto == null) {
            return null;
        }
        Apartment apartment = new Apartment();
        apartment.setName(dto.getName());
        apartment.setApartmentOwnerId(dto.getApartmentOwnerId());
        apartment.setDescription(dto.getDescription());
        return apartment;
    }

    public static void updateEntity(Apartment apartment, NewApartmentDTO dto) {
        if (apartment == null || dto == null) {
            return;
        }
        apartment.setName(dto.getName());
        apartment.setApartmentOwnerId(dto.getApartmentOwnerId());
        apartment.setDescription(dto.getDescription());
    }
}