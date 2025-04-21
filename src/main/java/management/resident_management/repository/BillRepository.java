package management.resident_management.repository;

import management.resident_management.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByResidentId(Long residentId);
    List<Bill> findByStatus(String status);
} 