import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { managementFeeService } from '../../services/admin/ManagementFeeService';
import { Fee } from '../../types/admin/FeeManagementType';
import axiosInstance from '../../services/axiosInstance';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  apartment: string;
  avatar: string;
}

const Payments = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Fee | null>(null);
  const [payments, setPayments] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);

  useEffect(() => {
    loadUserAndPayments();
  }, []);

  const loadUserAndPayments = async () => {
    try {
      // Get current user information
      const userResponse = await axiosInstance.get('/api/user/me');
      const userData = userResponse.data;
      setCurrentUser(userData);

      if (userData && userData.apartment) {
        // Extract apartment number from "Apartment X" format
        const apartmentNumber = userData.apartment.split(' ')[1];
        // Get fees for the user's apartment
        const data = await managementFeeService.getFeesByApartment(parseInt(apartmentNumber));
        setPayments(data);
      }
    } catch (error) {
      console.error('Error loading user and payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (payment: Fee) => {
    setSelectedPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment || !currentUser) return;

    try {
      setProcessingPayment(selectedPayment.id);
      handleClosePaymentDialog();

      // Create payment intent with residentId
      const paymentIntent = await axiosInstance.post('/api/fee/payment-intent', {
        feeId: selectedPayment.id,
        residentId: currentUser.id
      });

      // Update the payment status to PROCESSING in the local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === selectedPayment.id 
            ? { ...payment, status: 'PROCESSING' }
            : payment
        )
      );

      // Confirm payment with query parameters
      await axiosInstance.post(`/api/fee/confirm-payment?feeId=${selectedPayment.id}&stripePaymentId=${paymentIntent.data.stripePaymentIntentId}`);

      // Reload payments to update status
      await loadUserAndPayments();
    } catch (error) {
      console.error('Error processing payment:', error);
      // Reset processing state on error
      setProcessingPayment(null);
      // Reload payments to ensure correct state
      await loadUserAndPayments();
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'UNPAID':
        return 'warning';
      case 'OVERDUE':
        return 'error';
      case 'PROCESSING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'UNPAID':
        return 'Chờ thanh toán';
      case 'OVERDUE':
        return 'Quá hạn';
      case 'PROCESSING':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!currentUser) {
    return <Typography>Không tìm thấy thông tin người dùng</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Đóng phí
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Căn hộ: {currentUser.apartment}
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
                <TableCell>{payment.feeTypeId}</TableCell>
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
                  {processingPayment === payment.id ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      disabled={payment.status === 'PAID' || payment.status === 'PROCESSING'}
                      onClick={() => handlePayment(payment)}
                    >
                      Thanh toán
                    </Button>
                  )}
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
                  value={selectedPayment.feeTypeId}
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
                  value={selectedPayment.description || ''}
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