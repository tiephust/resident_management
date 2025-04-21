import React from 'react';
import PageTemplate from '../components/PageTemplate';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Bills', value: '12', icon: <ReceiptIcon />, color: 'primary.main' },
    { title: 'Active Residents', value: '8', icon: <PeopleIcon />, color: 'success.main' },
    { title: 'Total Payments', value: '24', icon: <PaymentIcon />, color: 'info.main' },
  ];

  return (
    <PageTemplate title="Dashboard">
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      color: 'white',
                      p: 1,
                      borderRadius: 1,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6">{stat.title}</Typography>
                </Box>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageTemplate>
  );
};

export default Dashboard; 