import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../services/notification.service';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    unitNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        email: formData.email.toLowerCase(), // Convert to lowercase
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        unitNumber: formData.unitNumber,
      });

      showSuccess('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      showError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={formData.email !== '' && !validateEmail(formData.email)}
            helperText={formData.email !== '' && !validateEmail(formData.email) ? 'Please enter a valid email address' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            id="phoneNumber"
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="unitNumber"
            label="Unit Number"
            id="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link href="/login">Sign in</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 