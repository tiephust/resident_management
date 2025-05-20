import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
    InputAdornment,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Edit as EditIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Home as HomeIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

import type { Profile as ProfileType, PasswordForm } from "../../types/Profile";
import { userService } from '../../services/UserService';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [profile, setProfile] = useState<ProfileType>({
        name: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        apartment: null,
        avatar: null,
    });

    const [editedProfile, setEditedProfile] = useState<ProfileType>(profile);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            console.log("loading");
            setLoading(true);
            const userData = await userService.getCurrentUser();
            console.log(userData);
            setProfile(userData);
            console.log("Set succes");
            setEditedProfile(userData);
            setError(null);
        } catch (err) {
            setError('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditedProfile(profile);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedProfile = await userService.updateProfile(editedProfile);
            setProfile(updatedProfile);
            setIsEditing(false);
            setSuccess('Cập nhật thông tin thành công');
            setError(null);
        } catch (err) {
            setError('Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleOpenChangePassword = () => {
        setChangePasswordOpen(true);
        setPasswordError('');
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleCloseChangePassword = () => {
        setChangePasswordOpen(false);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Mật khẩu mới không khớp');
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        try {
            setLoading(true);
            await userService.changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword,
                passwordForm.confirmPassword
            );
            handleCloseChangePassword();
            setSuccess('Đổi mật khẩu thành công');
            setError(null);
        } catch (err) {
            setPasswordError('Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.name) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    {/* Avatar and basic info */}
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={profile.avatar ?? undefined}
                            sx={{
                                width: 200,
                                height: 200,
                                margin: '0 auto',
                                border: '4px solid #f5f5f5',
                            }}
                        />
                        <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                            {profile.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {profile.role}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {!isEditing && (
                                <>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                        Chỉnh sửa thông tin
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<LockIcon />}
                                        onClick={handleOpenChangePassword}
                                        disabled={loading}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>

                    {/* Detailed information */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Thông tin cá nhân
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={editedProfile.email}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                            disabled
                                        />
                                    ) : (
                                        <Typography>{profile.email}</Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Số điện thoại"
                                            value={editedProfile.phone}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                        />
                                    ) : (
                                        <Typography>{profile.phone || 'Chưa cập nhật'}</Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Địa chỉ"
                                            value={editedProfile.address}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                                        />
                                    ) : (
                                        <Typography>{profile.address || 'Chưa cập nhật'}</Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography>{profile.apartment || 'Chưa được gán căn hộ'}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {isEditing && (
                            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    Lưu thay đổi
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Change Password Dialog */}
            <Dialog
                open={changePasswordOpen}
                onClose={handleCloseChangePassword}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Đổi mật khẩu
                        </Typography>
                        <IconButton onClick={handleCloseChangePassword}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            type={showCurrentPassword ? 'text' : 'password'}
                            label="Mật khẩu hiện tại"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showNewPassword ? 'text' : 'password'}
                            label="Mật khẩu mới"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Xác nhận mật khẩu mới"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleCloseChangePassword} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile; 