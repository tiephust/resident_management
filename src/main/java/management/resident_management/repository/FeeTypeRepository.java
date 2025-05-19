package management.resident_management.repository;

import management.resident_management.entity.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeTypeRepository extends JpaRepository<FeeType, Long> {
    Optional<FeeType> findByName(String name);
    List<FeeType> findByCategory(String category);
    List<FeeType> findByIsActiveTrue();
    List<FeeType> findByNameContainingOrDescriptionContaining(String name, String description);
}