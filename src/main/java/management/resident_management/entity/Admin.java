package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    
    @Column(nullable = false)
    private String department;
}