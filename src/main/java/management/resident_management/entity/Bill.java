package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String status; // PENDING, PAID, FAILED

    @Column(nullable = false)
    private LocalDateTime dueDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String stripePaymentId;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = "PENDING";
    }
} 