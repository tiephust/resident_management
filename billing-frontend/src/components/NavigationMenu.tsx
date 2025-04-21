import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Paper,
  Link,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const NavigationMenu: React.FC = () => {
  const routes = {
    main: {
      title: 'Main Pages',
      description: 'Core application pages accessible to all users',
      items: [
        { path: '/', name: 'Home', icon: <HomeIcon />, description: 'Root page (redirects to dashboard)' },
        { path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon />, description: 'Main application dashboard' },
        { path: '/bills', name: 'Bills', icon: <ReceiptIcon />, description: 'Bills management system' },
        { path: '/residents', name: 'Residents', icon: <PeopleIcon />, description: 'Residents management' },
        { path: '/payments', name: 'Payments', icon: <PaymentIcon />, description: 'Payments management' },
      ],
    },
    resident: {
      title: 'Resident Pages',
      description: 'Pages specific to resident users',
      items: [
        { path: '/resident/dashboard', name: 'Resident Dashboard', icon: <DashboardIcon />, description: 'Resident-specific dashboard' },
        { path: '/resident/bills', name: 'My Bills', icon: <ReceiptIcon />, description: 'View and manage personal bills' },
        { path: '/resident/payments', name: 'My Payments', icon: <PaymentIcon />, description: 'View and manage personal payments' },
        { path: '/resident/profile', name: 'My Profile', icon: <PersonIcon />, description: 'Manage personal profile information' },
      ],
    },
    admin: {
      title: 'Admin Pages',
      description: 'Pages accessible only to administrators',
      items: [
        { path: '/admin/dashboard', name: 'Admin Dashboard', icon: <DashboardIcon />, description: 'Administrative dashboard' },
        { path: '/admin/residents', name: 'Manage Residents', icon: <PeopleIcon />, description: 'Manage resident accounts' },
        { path: '/admin/bills', name: 'Manage Bills', icon: <ReceiptIcon />, description: 'Manage all bills' },
        { path: '/admin/payments', name: 'Manage Payments', icon: <PaymentIcon />, description: 'Manage all payments' },
        { path: '/admin/settings', name: 'Admin Settings', icon: <SettingsIcon />, description: 'System settings and configuration' },
      ],
    },
    user: {
      title: 'User Pages',
      description: 'General user pages',
      items: [
        { path: '/user/dashboard', name: 'User Dashboard', icon: <DashboardIcon />, description: 'User dashboard' },
        { path: '/user/profile', name: 'My Profile', icon: <PersonIcon />, description: 'User profile management' },
        { path: '/user/settings', name: 'Settings', icon: <SettingsIcon />, description: 'User preferences and settings' },
      ],
    },
    error: {
      title: 'Error Pages',
      description: 'System error and status pages',
      items: [
        { path: '/404', name: 'Not Found', icon: <ErrorIcon />, description: 'Page not found error' },
        { path: '/403', name: 'Forbidden', icon: <SecurityIcon />, description: 'Unauthorized access error' },
        { path: '/500', name: 'Server Error', icon: <ErrorIcon />, description: 'Internal server error' },
      ],
    },
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Application Pages
      </Typography>
      
      <Grid container spacing={3}>
        {Object.entries(routes).map(([category, section]) => (
          <Grid item xs={12} key={category}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {section.description}
                </Typography>
                <List>
                  {section.items.map((item) => (
                    <ListItem
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.name}
                            <Chip
                              label={item.path}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NavigationMenu; 