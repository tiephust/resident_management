package management.resident_management.dto;

import lombok.NoArgsConstructor;
import management.resident_management.entity.Admin;
import management.resident_management.entity.Resident;
import management.resident_management.entity.UserRole;

@NoArgsConstructor
public class ProfileDto {
    private String name;
    private UserRole userRole;
    private String email;
    private String phone;
    private String address;
    private String department;

    public ProfileDto toProFileDto (Admin admin) {
        ProfileDto profileDto = new ProfileDto();
        profileDto.name = name;
        profileDto.email = email;
        profileDto.phone = phone;
        profileDto.address = address;
        profileDto.department = department;
        profileDto.userRole = userRole;
        return profileDto;
    }

    public ProfileDto toProFileDto (Resident resident) {
        ProfileDto profileDto = new ProfileDto();
        profileDto.name = name;
        profileDto.email = email;
        profileDto.phone = phone;
        profileDto.address = address;
        profileDto.department = department;
        profileDto.userRole = userRole;
        return profileDto;
    }
}

