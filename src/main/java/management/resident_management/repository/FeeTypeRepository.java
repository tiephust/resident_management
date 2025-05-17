package management.resident_management.repository;

import management.resident_management.entity.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeeTypeRepository extends JpaRepository<FeeType, Long> {
    List<FeeType> findByNameContainingOrCategoryContaining(String name, String category);
    List<FeeType> findByCategory(String category);
    List<FeeType> findByIsActive(Boolean isActive);
} 