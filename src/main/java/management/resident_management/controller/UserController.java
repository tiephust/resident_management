package management.resident_management.controller;

import management.resident_management.dto.PasswordChangeDto;
import management.resident_management.dto.UserUpdateDto;
import management.resident_management.entity.User;
import management.resident_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserUpdateDto userUpdateDto) {
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