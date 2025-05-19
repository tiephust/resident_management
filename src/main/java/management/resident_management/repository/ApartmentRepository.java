package management.resident_management.repository;

import management.resident_management.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    Optional<Apartment> findByName(String name);
    List<Apartment> findByNameContainingOrDescriptionContaining(String name, String description);
}