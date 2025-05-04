  import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../services/notification.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: email.toLowerCase(), // Convert to lowercase
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      showSuccess('Login successful!');
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      showError('Invalid email or password');
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
          Sign in
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email !== '' && !validateEmail(email)}
            helperText={email !== '' && !validateEmail(email) ? 'Please enter a valid email address' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Don't have an account?{' '}
              <Link href="/register">Sign up</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 