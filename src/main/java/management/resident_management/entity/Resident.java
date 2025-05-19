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

    @Column
    private String stripeCustomerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
    private List<Report> reports;

    @Column
    private LocalDate leaseStartDate;

    @Column
    private LocalDate leaseEndDate;

    @Column
    private String status;
}
