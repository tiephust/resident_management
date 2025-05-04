package management.resident_management.validation;

import jakarta.validation.Payload;

public @interface ValidPassword {
    String message() default "Password must include at least one uppercase letter and one special character"; // Password phải bao gồm ít nhất một chữ in hoa và một ký tự đặc biệt

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
