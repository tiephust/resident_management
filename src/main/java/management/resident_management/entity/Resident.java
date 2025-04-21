package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("RESIDENT")
public class Resident extends User {
    
    @Column(unique = true)
    private String stripeCustomerId;

    @OneToMany(mappedBy = "resident")
    private List<Bill> bills;
}
