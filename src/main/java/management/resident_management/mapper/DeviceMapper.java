package management.resident_management.mapper;

import management.resident_management.dto.DeviceDTO;
import management.resident_management.dto.NewDeviceDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Device;

public class DeviceMapper {

    public static DeviceDTO toDTO(Device device) {
        if (device == null) {
            return null;
        }
        DeviceDTO dto = new DeviceDTO();
        dto.setId(device.getId());
        dto.setName(device.getName());
        dto.setApartmentId(device.getApartment() != null ? device.getApartment().getId() : null);
        dto.setType(device.getType());
        dto.setNumberCard(device.getNumberCard());
        dto.setDescription(device.getDescription());
        dto.setCreatedAt(device.getCreatedAt());
        dto.setUpdatedAt(device.getUpdatedAt());
        dto.setMaintenanceAt(device.getMaintenanceAt());
        dto.setStatus(device.getStatus());
        return dto;
    }

    public static Device toEntity(NewDeviceDTO dto) {
        if (dto == null) {
            return null;
        }
        Device device = new Device();
        device.setName(dto.getName());
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        device.setApartment(apartment);
        device.setType(dto.getType());
        device.setNumberCard(dto.getNumberCard());
        device.setDescription(dto.getDescription());
        device.setMaintenanceAt(dto.getMaintenanceAt());
        device.setStatus(dto.getStatus());
        return device;
    }

    public static void updateEntity(Device device, NewDeviceDTO dto) {
        if (device == null || dto == null) {
            return;
        }
        device.setName(dto.getName());
        Apartment apartment = new Apartment();
        apartment.setId(dto.getApartmentId());
        device.setApartment(apartment);
        device.setType(dto.getType());
        device.setNumberCard(dto.getNumberCard());
        device.setDescription(dto.getDescription());
        device.setMaintenanceAt(dto.getMaintenanceAt());
        device.setStatus(dto.getStatus());
    }
}