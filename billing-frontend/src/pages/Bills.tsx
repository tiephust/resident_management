import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Bill, PaymentIntentResponse } from '../types';
import PaymentForm from '../components/PaymentForm';
import PageTemplate from '../components/PageTemplate';
import { Add as AddIcon } from '@mui/icons-material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bills`);
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const handlePayClick = async (bill: Bill) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/create-payment-intent?billId=${bill.id}`);
      setPaymentIntent(response.data);
      setSelectedBill(bill);
      setOpen(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBill(null);
    setPaymentIntent(null);
  };

  return (
    <PageTemplate title="Bills Management">
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add new bill */}}
        >
          Add New Bill
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.description}</TableCell>
                <TableCell align="right">${bill.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{bill.status}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => {/* Handle edit */}}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => {/* Handle delete */}}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Payment</DialogTitle>
        <DialogContent>
          {paymentIntent && selectedBill && (
            <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.client_secret }}>
              <PaymentForm
                paymentIntent={paymentIntent}
                onSuccess={() => {
                  handleClose();
                  fetchBills();
                }}
                onCancel={handleClose}
              />
            </Elements>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </PageTemplate>
  );
};

export default Bills; 