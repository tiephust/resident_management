import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ServerErrorProps {}

const ServerError: React.FC<ServerErrorProps> = () => {
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
        500
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Lỗi máy chủ
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.
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

export default ServerError; 