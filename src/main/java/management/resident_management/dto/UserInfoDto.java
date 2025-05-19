package management.resident_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import management.resident_management.entity.User;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String apartment;
    private String role;

    public static UserInfoDto toUserInforDto(User user) {
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setId(user.getId());
        userInfoDto.setName(user.getName());
        userInfoDto.setEmail(user.getEmail());
        userInfoDto.setRole(user.getRole().toString());
        return userInfoDto;
    }
}