package management.resident_management.controller;

import management.resident_management.dto.PasswordChangeDto;
import management.resident_management.dto.UserInfoDto;
import management.resident_management.dto.UserUpdateDto;
import management.resident_management.entity.User;
import management.resident_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserInfoDto userInfo = UserInfoDto.toUserInforDto(userService.getUserByEmail(email));
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdateDto userUpdateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(userService.updateUser(user.getId(), userUpdateDto));
    }


    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PasswordChangeDto passwordChangeDto) {
        userService.changePassword(user.getId(), passwordChangeDto);
        return ResponseEntity.ok().build();
    }
} 