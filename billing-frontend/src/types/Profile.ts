export interface Profile {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    apartment: string | null;
    avatar: string | null;
}

export interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}