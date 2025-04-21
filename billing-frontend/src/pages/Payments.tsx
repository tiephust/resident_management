import React from 'react';
import PageTemplate from '../components/PageTemplate';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Payments: React.FC = () => {
  // Mock data for demonstration
  const payments = [
    {
      id: 1,
      residentName: 'John Doe',
      amount: 1200,
      date: '2024-04-20',
      status: 'Completed',
      method: 'Credit Card',
    },
    {
      id: 2,
      residentName: 'Jane Smith',
      amount: 150,
      date: '2024-04-19',
      status: 'Completed',
      method: 'Bank Transfer',
    },
    // Add more mock payments as needed
  ];

  return (
    <PageTemplate title="Payments Management">
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add new payment */}}
        >
          Record New Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resident</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.residentName}</TableCell>
                <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => {/* Handle view details */}}>
                    View
                  </Button>
                  <Button size="small" color="error" onClick={() => {/* Handle refund */}}>
                    Refund
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageTemplate>
  );
};

export default Payments; 