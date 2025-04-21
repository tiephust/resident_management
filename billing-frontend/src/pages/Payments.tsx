import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import { Bill } from '../types';

const Payments = () => {
  const [paidBills, setPaidBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetchPaidBills();
  }, []);

  const fetchPaidBills = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bills?status=PAID');
      setPaidBills(response.data);
    } catch (error) {
      console.error('Error fetching paid bills:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payment History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Resident</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Payment ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paidBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.description}</TableCell>
                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                <TableCell>{bill.resident.name}</TableCell>
                <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{bill.stripePaymentId || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Payments; 