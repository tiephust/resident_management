import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Stack,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    PersonOff as AbsenceIcon,
    PersonAdd as TemporaryResidentIcon,
    Notifications as NotificationsIcon,
    Home as HomeIcon,
    Phone as PhoneIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import PageTemplate from '../../components/PageTemplate';
import { userService } from '../../services/UserService';
import { Profile } from '../../types/Profile';

interface Notification {
    id: number;
    title: string;
    content: string;
    date: string;
}

const ResidentDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await userService.getCurrentUser();
                setUser(userData);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Mock notifications data
    const notifications: Notification[] = [
        {
            id: 1,
            title: 'Thông báo đã duyệt phản ánh',
            content: 'Phản ánh về dịch vụ của bạn đã được duyệt',
            date: '25/12/2023',
        },
        {
            id: 2,
            title: 'Thông báo đóng phí',
            content: 'Đã cập nhật các khoản phí mới vui lòng đóng phí đúng hạn.',
            date: '25/12/2023',
        },
    ];

    if (loading) {
        return <Typography>Đang tải...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <PageTemplate>
            <Box sx={{ p: 3 }}>
                {/* Welcome Section with User Info */}
                <Paper sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: 3
                }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3} display="flex" justifyContent="center">
                            <Avatar sx={{
                                width: 120,
                                height: 120,
                                bgcolor: 'white',
                                color: '#1976d2',
                                fontSize: '3rem'
                            }}>
                                <PersonIcon fontSize="inherit" />
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Xin chào, {user?.name}!
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                                Chào mừng bạn quay trở lại hệ thống quản lý chung cư
                            </Typography>

                            <Stack direction="row" spacing={2} mt={3}>
                                <Chip
                                    icon={<PhoneIcon />}
                                    label={`Điện thoại: ${user?.phone || 'Chưa cập nhật'}`}
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        padding: '8px 12px'
                                    }}
                                />
                                <Chip
                                    icon={<HomeIcon />}
                                    label={`Mã căn hộ: ${user?.apartmentId || 'Chưa cập nhật'}`}
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        padding: '8px 12px'
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Quick Actions Section */}
                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'medium' }}>
                    Thao tác nhanh
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                height: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 4,
                                },
                                borderLeft: '4px solid #1976d2',
                                borderRadius: 1
                            }}
                            onClick={() => navigate('/resident/absence')}
                        >
                            <AbsenceIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" align="center" sx={{ fontWeight: 'medium' }}>
                                Khai báo tạm vắng
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Thông báo khi bạn vắng nhà dài ngày
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                height: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 4,
                                },
                                borderLeft: '4px solid #4caf50',
                                borderRadius: 1
                            }}
                            onClick={() => navigate('/resident/temporary')}
                        >
                            <TemporaryResidentIcon sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" align="center" sx={{ fontWeight: 'medium' }}>
                                Khai báo tạm trú
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                Đăng ký cho khách đến ở tạm thời
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Notifications Section */}
                <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'white'
                    }}>
                        <NotificationsIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            Thông báo mới nhất
                        </Typography>
                    </Box>
                    <Divider />
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                    {notification.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {notification.date}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {notification.content}
                                            </Typography>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        </PageTemplate>
    );
};

export default ResidentDashboard;