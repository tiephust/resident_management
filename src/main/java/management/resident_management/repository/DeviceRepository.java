package management.resident_management.repository;

import management.resident_management.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByNumberCard(String numberCard);
    List<Device> findByNameContainingOrNumberCardContaining(String name, String numberCard);
    List<Device> findByStatus(String status);
}