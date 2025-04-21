import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface Payment {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

const Payments = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      type: 'Phí quản lý',
      amount: 500000,
      dueDate: '2024-01-31',
      status: 'pending',
      description: 'Phí quản lý tháng 1/2024',
    },
    {
      id: '2',
      type: 'Phí gửi xe',
      amount: 200000,
      dueDate: '2024-01-31',
      status: 'paid',
      description: 'Phí gửi xe tháng 1/2024',
    },
    {
      id: '3',
      type: 'Tiền điện',
      amount: 750000,
      dueDate: '2024-01-15',
      status: 'overdue',
      description: 'Tiền điện tháng 12/2023',
    },
  ];

  const handlePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmPayment = () => {
    // Handle payment confirmation here
    console.log('Processing payment:', selectedPayment);
    handleClosePaymentDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Đóng phí
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loại phí</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Hạn thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.amount.toLocaleString('vi-VN')} đ</TableCell>
                <TableCell>{new Date(payment.dueDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(payment.status)}
                    color={getStatusColor(payment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    disabled={payment.status === 'paid'}
                    onClick={() => handlePayment(payment)}
                  >
                    Thanh toán
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Xác nhận thanh toán
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Thông tin thanh toán:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Loại phí"
                  value={selectedPayment.type}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số tiền"
                  value={`${selectedPayment.amount.toLocaleString('vi-VN')} đ`}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={selectedPayment.description}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            onClick={handleConfirmPayment}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments; 