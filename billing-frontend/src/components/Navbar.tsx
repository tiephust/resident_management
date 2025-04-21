import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Billing System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/bills">
            Bills
          </Button>
          <Button color="inherit" component={RouterLink} to="/payments">
            Payments
          </Button>
          <Button color="inherit" component={RouterLink} to="/residents">
            Residents
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 