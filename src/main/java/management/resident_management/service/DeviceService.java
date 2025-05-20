package management.resident_management.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import management.resident_management.dto.DeviceDTO;
import management.resident_management.dto.NewDeviceDTO;
import management.resident_management.entity.Apartment;
import management.resident_management.entity.Device;
import management.resident_management.mapper.DeviceMapper;
import management.resident_management.repository.ApartmentRepository;
import management.resident_management.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ApartmentRepository apartmentRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // Only initialize if no devices exist
        if (deviceRepository.count() == 0) {
            // Create sample devices for each apartment
            for (int i = 0; i < 10; i++) {
                Device device = new Device();
                device.setName("Device " + (i + 1));
                // Link device to an apartment (cycling through first 5 apartments)
                Apartment apartment = apartmentRepository.findById((long) ((i % 5) + 1)).orElse(null);
                device.setApartment(apartment);
                device.setType(i % 2 == 0 ? "SENSOR" : "ACTUATOR");
                device.setNumberCard("CARD" + String.format("%03d", i + 1));
                device.setDescription("Description for Device " + (i + 1));
                device.setStatus("ACTIVE");
                device.setCreatedAt(LocalDateTime.now());
                device.setUpdatedAt(LocalDateTime.now());
                device.setMaintenanceAt(LocalDateTime.now().plusDays(30));
                deviceRepository.save(device);
            }
        }
    }

    public List<DeviceDTO> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(DeviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO getDeviceById(Long id) {
        return deviceRepository.findById(id)
                .map(DeviceMapper::toDTO)
                .orElse(null);
    }

    public DeviceDTO createDevice(NewDeviceDTO deviceDTO) {
        Device device = DeviceMapper.toEntity(deviceDTO);
        if (device == null) {
            throw new IllegalArgumentException("Invalid device data");
        }
        Apartment apartment = apartmentRepository.findById(deviceDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        device.setApartment(apartment);
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        Device savedDevice = deviceRepository.save(device);
        return DeviceMapper.toDTO(savedDevice);
    }

    public DeviceDTO updateDevice(Long id, NewDeviceDTO deviceDTO) {
        Device existingDevice = deviceRepository.findById(id).orElse(null);
        if (existingDevice == null) {
            return null;
        }
        DeviceMapper.updateEntity(existingDevice, deviceDTO);
        Apartment apartment = apartmentRepository.findById(deviceDTO.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));
        existingDevice.setApartment(apartment);
        existingDevice.setUpdatedAt(LocalDateTime.now());
        Device updatedDevice = deviceRepository.save(existingDevice);
        return DeviceMapper.toDTO(updatedDevice);
    }

    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    public List<DeviceDTO> searchDevices(String searchTerm) {
        return deviceRepository.findByNameContainingOrNumberCardContaining(searchTerm, searchTerm).stream()
                .map(DeviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<DeviceDTO> getDevicesByStatus(String status) {
        return deviceRepository.findByStatus(status).stream()
                .map(DeviceMapper::toDTO)
                .collect(Collectors.toList());
    }
}