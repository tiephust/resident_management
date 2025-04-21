import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
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
      <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Trang không tồn tại
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
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

export default NotFound; 