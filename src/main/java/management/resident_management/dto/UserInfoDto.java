package management.resident_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.resident_management.entity.User;
import management.resident_management.entity.UserRole;
import management.resident_management.entity.Resident;
import management.resident_management.entity.Apartment;
import management.resident_management.repository.ResidentRepository;
import management.resident_management.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String apartment;
    private String avatar;

    public static UserInfoDto toUserInfoDto(User user, ResidentRepository residentRepository) {
        UserInfoDto dto = new UserInfoDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole().name());
        dto.setAvatar("");

        if (user.getRole() == UserRole.RESIDENT) {
            Resident resident = residentRepository.findById(user.getId())
                .orElse(null);
            if (resident != null && resident.getApartment() != null) {
                dto.setApartment(resident.getApartment().getName());
            } else {
                dto.setApartment("Chưa được gán căn hộ");
            }
        } else {
            dto.setApartment("Ban quản lý");
        }

        return dto;
    }
}