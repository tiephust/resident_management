package management.resident_management.repository;

import management.resident_management.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByDescriptionContainingIgnoreCase(String description);
    List<Fee> findByStatus(Fee.FeeStatus status);
    List<Fee> findByResidentId(Long residentId);
}