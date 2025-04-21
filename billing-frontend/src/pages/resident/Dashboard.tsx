import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import axios from 'axios';
import { Bill } from '../../types';

const ResidentDashboard: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bills/my-bills`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBills(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bills');
      setLoading(false);
    }
  };

  const handlePayBill = async (billId: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-payment-intent`,
        { billId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Handle payment intent creation
      console.log('Payment intent created:', response.data);
    } catch (err) {
      setError('Failed to create payment intent');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resident Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bills
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.description}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{bill.status}</TableCell>
                      <TableCell>
                        {bill.status === 'PENDING' && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePayBill(bill.id)}
                          >
                            Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills
                    .filter((bill) => bill.status === 'PAID')
                    .map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{new Date(bill.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>${bill.amount.toFixed(2)}</TableCell>
                        <TableCell>{bill.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResidentDashboard; 