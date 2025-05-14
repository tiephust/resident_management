import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
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
      showError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const userInfo = await authService.login(email.toLowerCase(), password);
      console.log('Login successful, user info:', userInfo);
      
      if (userInfo) {
        showSuccess('Đăng nhập thành công');
        
        // Get role from cookie
        const role = authService.getRole();
        console.log('User role:', role);
        
        // Redirect based on role
        if (role === 'ADMIN') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'RESIDENT') {
          console.log('Redirecting to resident dashboard');
          navigate('/resident/dashboard', { replace: true });
        } else {
          console.log('Unknown role, redirecting to home');
          navigate('/', { replace: true });
        }
      } else {
        showError('Không thể lấy thông tin người dùng');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showError(err.message || 'Email hoặc mật khẩu không đúng');
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
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email !== '' && !validateEmail(email)}
            helperText={email !== '' && !validateEmail(email) ? 'Vui lòng nhập địa chỉ email hợp lệ' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
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
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/forgot-password" variant="body2">
              Quên mật khẩu?
            </Link>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Chưa có tài khoản?{' '}
              <Link href="/register">Đăng ký</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 