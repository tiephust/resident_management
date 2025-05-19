import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as StatisticsIcon,
  Description as ReportsIcon,
  People as ResidentsIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Feedback as FeedbackIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Apartment as ApartmentIcon,
  BarChart as BarChartIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import authService from '../services/authService';

const drawerWidth = 280;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const adminName = "Văn Thanh";
  const adminRole = "Ban quản lý";

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Thống kê', icon: <StatisticsIcon />, path: '/admin/statistics' },
    { text: 'Quản lý cư dân', icon: <ResidentsIcon />, path: '/admin/resident-management' },
    { text: 'Quản lý tạm vắng', icon: <PersonAddIcon />, path: '/admin/temporary-residents' },
    { text: 'Quản lý thông tin căn hộ', icon: <ApartmentIcon />, path: '/admin/apartment-details' },
    { text: 'Quản lý loaị phí', icon: <SettingsIcon />, path: '/admin/fee-types' },
    { text: 'Quản lý đóng phí', icon: <PaymentIcon />, path: '/admin/fee-management' },
    { text: 'Quản lý thiết bị', icon: <BuildIcon />, path: '/admin/devices' },
    // { text: 'Thông báo', icon: <NotificationsIcon />, path: '/admin/notifications' },
    { text: 'Phản hồi', icon: <FeedbackIcon />, path: '/admin/feedback' },
  ];

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  const drawer = (
    <>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.04)',
          },
          borderRadius: 1,
        }}
        onClick={handleProfileClick}
      >
        <Avatar 
          src="/path-to-admin-avatar.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Box>
          <Typography variant="h6" color="textPrimary">
            {adminName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {adminRole}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ overflow: 'auto', px: 2, py: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          boxShadow: 'none',
          borderBottom: '1px solid #eee',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '200px' }} /> {/* Spacer */}
          <Typography 
            variant="h4" 
            color="primary" 
            sx={{ 
              flexGrow: 0,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Soc Son Plaza
          </Typography>
          <Box sx={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
            >
              {adminName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#f5f7fa',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
          marginTop: '64px',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 2,
            display: { sm: 'none' },
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 1200,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 