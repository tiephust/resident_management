package management.resident_management.controller;

import management.resident_management.dto.PasswordFormDto;
import management.resident_management.dto.UserInfoDto;
import management.resident_management.dto.UserUpdateDto;
import management.resident_management.entity.User;
import management.resident_management.repository.ResidentRepository;
import management.resident_management.service.ResidentService;
import management.resident_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ResidentRepository residentRepository;

    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        UserInfoDto userInfo = UserInfoDto.toUserInfoDto(userService.getUserByEmail(email), residentRepository);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdateDto userUpdateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(userService.updateUser(user.getId(), userUpdateDto));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordFormDto passwordFormDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        userService.changePassword(user.getId(), passwordFormDto);
        return ResponseEntity.ok().build();
    }
}