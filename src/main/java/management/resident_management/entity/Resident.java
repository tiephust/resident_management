package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "residents")
public class Resident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private String stripeCustomerId;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
    private List<Bill> bills;
}
