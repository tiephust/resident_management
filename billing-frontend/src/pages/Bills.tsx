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
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Bill, PaymentIntentResponse } from '../types';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const Bills = () => {
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
    <div>
      <Typography variant="h4" gutterBottom>
        Bills
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.description}</TableCell>
                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                <TableCell>{bill.status}</TableCell>
                <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {bill.status === 'PENDING' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePayClick(bill)}
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
    </div>
  );
};

export default Bills; 