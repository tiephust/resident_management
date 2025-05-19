package management.resident_management.repository;

import management.resident_management.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {
    Optional<Resident> findByEmail(String email);
    Optional<Resident> findByStripeCustomerId(String stripeCustomerId);
    List<Resident> findByNameContainingOrEmailContainingOrPhoneNumberContaining(String name, String email, String phoneNumber);
    List<Resident> findByStatus(String status);
    List<Resident> findByUnitNumber(String unitNumber);
    List<Resident> findByApartmentId(Long apartmentId);
}