//package management.resident_management.config;
//
//import management.resident_management.entity.Admin;
//import management.resident_management.entity.Resident;
//import management.resident_management.entity.UserRole;
//import management.resident_management.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (userRepository.count() == 0) {
//            // Create and save admin users first
//            List<Admin> admins = new ArrayList<>();
//            admins.add(createAdmin("John Doe", "john@example.com", "password123", "Management"));
//            admins.add(createAdmin("Jane Smith", "jane@example.com", "password123", "Finance"));
//            admins.add(createAdmin("Mike Johnson", "mike@example.com", "password123", "Operations"));
//            userRepository.saveAll(admins);
//
//            // Create and save resident users
//            List<Resident> residents = new ArrayList<>();
//            residents.add(createResident("Alice Brown", "alice@example.com", "password123", "A101", "555-0101"));
//            residents.add(createResident("Bob Wilson", "bob@example.com", "password123", "A102", "555-0102"));
//            residents.add(createResident("Carol Davis", "carol@example.com", "password123", "A103", "555-0103"));
//            residents.add(createResident("David Miller", "david@example.com", "password123", "B101", "555-0104"));
//            residents.add(createResident("Eve Taylor", "eve@example.com", "password123", "B102", "555-0105"));
//            residents.add(createResident("Frank Anderson", "frank@example.com", "password123", "B103", "555-0106"));
//            residents.add(createResident("Grace White", "grace@example.com", "password123", "C101", "555-0107"));
//            residents.add(createResident("Henry Clark", "henry@example.com", "password123", "C102", "555-0108"));
//            residents.add(createResident("Ivy Lee", "ivy@example.com", "password123", "C103", "555-0109"));
//            residents.add(createResident("Jack Moore", "jack@example.com", "password123", "D101", "555-0110"));
//            userRepository.saveAll(residents);
//        }
//    }
//
//    private Admin createAdmin(String name, String email, String password, String department) {
//        return Admin.builder()
//            .name(name)
//            .email(email)
//            .password(passwordEncoder.encode(password))
//            .role(UserRole.ADMIN)
//            .department(department)
//            .isActive(true)
//            .build();
//    }
//
//    private Resident createResident(String name, String email, String password, String unitNumber, String phoneNumber) {
//        return Resident.builder()
//            .name(name)
//            .email(email)
//            .password(passwordEncoder.encode(password))
//            .role(UserRole.RESIDENT)
//            .unitNumber(unitNumber)
//            .phoneNumber(phoneNumber)
//            .isActive(true)
//            .leaseStartDate(LocalDate.now().minusMonths(6))
//            .leaseEndDate(LocalDate.now().plusMonths(6))
//            .build();
//    }
//}