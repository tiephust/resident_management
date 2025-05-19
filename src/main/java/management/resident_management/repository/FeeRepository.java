package management.resident_management.repository;

import management.resident_management.entity.Fee;
import management.resident_management.entity.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByApartmentId(Long apartmentId);
    List<Fee> findByDescriptionContaining(String description);
    List<Fee> findByStatus(FeeStatus status);
    List<Fee> findByResidentId(Long residentId);
    List<Fee> findByStatusAndResidentId(FeeStatus status, Long residentId);
}