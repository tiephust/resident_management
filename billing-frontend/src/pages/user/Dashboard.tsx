import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { Bill } from '../../types';

const UserDashboard: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/user/bills');
      setBills(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bills');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bills
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Bills
              </Typography>
              {/* Add bills table here */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserDashboard; 