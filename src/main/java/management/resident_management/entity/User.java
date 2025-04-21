package management.resident_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    @Enumerated(EnumType.STRING) // This is the critical annotation
    @Column(nullable = false)
    private Role role;

    private String email;

    private String phone;

    private LocalDateTime createAt;

    private String refreshToken;

    public enum Role {
        ADMIN,
        USER;

        public static Role fromString(String role) {
            return switch (role) {
                case "ADMIN" -> ADMIN;
                case "USER" -> USER;
                default -> throw new IllegalStateException("Unexpected value: " + role);
            };
        }
    }
}
