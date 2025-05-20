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
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  PersonOff as AbsenceIcon,
  PersonAdd as TemporaryResidentIcon,
  Feedback as FeedbackIcon,
  Comment as CommentIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import authService from '../services/authService';

const drawerWidth = 280;

const ResidentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const residentName = "Nguyễn Văn A";
  const residentRole = "Cư dân";

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/resident/dashboard' },
    { text: 'Đóng phí', icon: <PaymentIcon />, path: '/resident/payments' },
    { text: 'Khai báo tạm vắng', icon: <AbsenceIcon />, path: '/resident/absence' },
    // { text: 'Khai báo tạm trú', icon: <TemporaryResidentIcon />, path: '/resident/temporary' },
    { text: 'Phản ánh', icon: <FeedbackIcon />, path: '/resident/feedback' },
    { text: 'Ý kiến', icon: <CommentIcon />, path: '/resident/comments' },
  ];

  const handleProfileClick = () => {
    navigate('/resident/profile');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
          src="/path-to-resident-avatar.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <Box>
          <Typography variant="h6" color="textPrimary">
            {residentName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {residentRole}
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
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
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

export default ResidentLayout; 