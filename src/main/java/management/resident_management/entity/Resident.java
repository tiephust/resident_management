package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "residents")
@PrimaryKeyJoinColumn(name = "user_id")
public class Resident extends User {

    private String stripeCustomerId;

    @OneToMany(mappedBy = "resident")
    private List<Fee> fees;

    private LocalDate leaseStartDate;

    private LocalDate leaseEndDate;

//    @Column(nullable = false)
    private String department;

    private String status;

    private String building;
}
