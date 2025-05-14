import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../services/notification.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    async function checkAuth() {
      console.log('Checking authentication...');
      const userInfo = await authService.getCurrentUser();
      if (userInfo) {
        console.log('User authenticated:', userInfo);
        const role = authService.getRole();
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'RESIDENT') {
          navigate('/resident/dashboard', { replace: true });
        }
      } else {
        console.log('No authenticated user found');
      }
    }
    checkAuth();
  }, [navigate]);

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
      console.log('Submitting login form for email:', email);
      const userInfo = await authService.login(email.toLowerCase(), password);
      console.log('Login successful, user info:', userInfo);

      if (userInfo) {
        showSuccess('Đăng nhập thành công');
        const role = authService.getRole();
        console.log('User role:', role);

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
        showError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
        console.error('User info is null after successful login');
      }
    } catch (err: any) {
      console.error('Login error:', err.message, err);
      showError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
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
          <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
          >
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Địa chỉ email"
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
              {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
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