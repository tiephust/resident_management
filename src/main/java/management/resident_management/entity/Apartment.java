package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "apartments")
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "apartment")  // Trỏ đến tên field trong Fee class
    private List<Fee> fees;

    @OneToMany(mappedBy = "apartment")  // Trỏ đến tên field trong Resident class
    private List<Resident> residents;

    @OneToMany(mappedBy = "apartment")  // Trỏ đến tên field trong Device class
    private List<Device> devices;

    private String name;

    private Long apartmentOwnerId;

    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
