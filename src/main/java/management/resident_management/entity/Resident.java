package management.residentmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@PrimaryKeyJoinColumn(name = "id")
//@Table(name = "resident")
public class Resident extends User{
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    private String name;

    private String Identifier; // CMND/CCCD

    private String sex;

    private LocalDate dateOfBirth;

    private String job;

    private String address;

    private LocalDateTime creatAt;

    private LocalDateTime updateAt;

    private LocalDateTime deleteAt;

    private Long userId;

    private Status status;


    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeclarationForm> declarationForms;

    public enum Status {
        CREATED,
        UPDATED,
//        ACTIVE,
//        INACTIVE,
        DELETED;
    }
}
