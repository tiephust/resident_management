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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { Bill } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  PersonOff as AbsenceIcon,
  PersonAdd as TemporaryResidentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
}

const ResidentDashboard: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Thông báo đã duyệt phản ánh',
      content: 'Phản ánh về dịch vụ của bạn đã được duyệt',
      date: '25/12/2023',
    },
    {
      id: 2,
      title: 'Thông báo đóng phí',
      content: 'Đã cập nhật các khoản phí mới vui lòng đóng phí đúng hạn.',
      date: '25/12/2023',
    },
    // Add more notifications as needed
  ];

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
      
      {/* Large Action Buttons */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => navigate('/resident/absence')}
          >
            <AbsenceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" align="center">
              Khai báo tạm vắng
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => navigate('/resident/temporary')}
          >
            <TemporaryResidentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" align="center">
              Khai báo tạm trú
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Notifications Section */}
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Thông báo
          </Typography>
        </Box>
        <Divider />
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.date}
                      </Typography>
                    </Box>
                  }
                  secondary={notification.content}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

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