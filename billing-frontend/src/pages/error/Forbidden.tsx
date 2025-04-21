import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ForbiddenProps {}

const Forbidden: React.FC<ForbiddenProps> = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" color="error" sx={{ mb: 2 }}>
        403
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Truy cập bị từ chối
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bạn không có quyền truy cập vào trang này.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
      >
        Về trang chủ
      </Button>
    </Box>
  );
};

export default Forbidden; 