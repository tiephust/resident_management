package management.resident_management.repository;

import management.resident_management.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
    Optional<Resident> findByEmail(String email);
    Optional<Resident> findByStripeCustomerId(String stripeCustomerId);
} 