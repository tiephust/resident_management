import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { Bill } from '../types';

const Dashboard = () => {
  const [totalBills, setTotalBills] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [billsResponse, pendingResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/bills'),
        axios.get('http://localhost:8080/api/bills?status=PENDING'),
      ]);

      const bills = billsResponse.data;
      const pending = pendingResponse.data;

      setTotalBills(bills.length);
      setPendingBills(pending.length);
      setTotalAmount(bills.reduce((sum: number, bill: Bill) => sum + bill.amount, 0));
      setRecentBills(bills.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bills
              </Typography>
              <Typography variant="h4">{totalBills}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Bills
              </Typography>
              <Typography variant="h4">{pendingBills}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4">${totalAmount.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bills
            </Typography>
            <Grid container spacing={2}>
              {recentBills.map((bill) => (
                <Grid item xs={12} key={bill.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{bill.description}</Typography>
                    <Typography color="textSecondary">
                      Amount: ${bill.amount.toFixed(2)} | Status: {bill.status} | Due: {new Date(bill.dueDate).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 