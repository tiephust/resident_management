import * as React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, children }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
};

export default PageTemplate; 