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
//    @Column(nullable = false)
    private String unitNumber;

//    @Column(nullable = false)
    private LocalDate leaseStartDate;

//    @Column(nullable = false)
    private LocalDate leaseEndDate;

    @Column(nullable = true)
    private String stripeCustomerId;

    @OneToMany(mappedBy = "resident")
    private List<Bill> bills;

//    @Column(nullable = false)
    private String department;

    private String status;
}
