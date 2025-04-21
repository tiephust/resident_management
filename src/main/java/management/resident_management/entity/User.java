package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Column(nullable = false)
    private String name;

//    @Column(nullable = false, unique = true)
    private String email;

//    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
    private UserRole role;

//    @Column(nullable = false)
    private boolean isActive;

    @Column(nullable = true)
    private String phoneNumber;

    @Column(nullable = true)
    private String unitNumber;

    @Column(nullable = true)
    private LocalDate leaseStartDate;

    @Column(nullable = true)
    private LocalDate leaseEndDate;

//    @Column(nullable = false)
    private LocalDateTime createdAt;

//    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
