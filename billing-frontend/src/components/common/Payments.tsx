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
import { Payment as PaymentIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface Payment {
    id: string;
    type: string;
    amount: number;
    dueDate: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    description: string;
}

const PaymentForm: React.FC<{
    payment: Payment;
    onSuccess: () => void;
    onCancel: () => void;
}> = ({ payment, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Fetch client secret from backend
        fetch('/api/payments/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billId: payment.id, amount: payment.amount }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [payment]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });

        if (error) {
            setError(error.message || 'Payment failed');
            setProcessing(false);
        } else if (paymentIntent?.status === 'succeeded') {
            // Update payment status in backend
            await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ billId: payment.id, stripePaymentId: paymentIntent.id }),
            });
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
        <Grid item xs={12}>
    <CardElement options={{
        style: {
            base: {
                fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
        },
    }} />
    </Grid>
    {error && (
        <Grid item xs={12}>
    <Typography color="error">{error}</Typography>
        </Grid>
    )}
    </Grid>
    <DialogActions>
    <Button onClick={onCancel}>Hủy</Button>
        <Button
    type="submit"
    variant="contained"
    startIcon={<ReceiptIcon />}
    disabled={processing || !stripe || !clientSecret}
>
    {processing ? <CircularProgress size={24} /> : 'Xác nhận thanh toán'}
        </Button>
        </DialogActions>
        </form>
    );
    };

    const Payments: React.FC = () => {
        const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
        const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

        const payments: Payment[] = [
            {
                id: '1',
                type: 'Phí quản lý',
                amount: 500000,
                dueDate: '2024-01-31',
                status: 'PENDING',
                description: 'Phí quản lý tháng 1/2024',
            },
            {
                id: '2',
                type: 'Phí gửi xe',
                amount: 200000,
                dueDate: '2024-01-31',
                status: 'PAID',
                description: 'Phí gửi xe tháng 1/2024',
            },
            {
                id: '3',
                type: 'Tiền điện',
                amount: 750000,
                dueDate: '2024-01-15',
                status: 'OVERDUE',
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

        const handleSuccess = () => {
            handleClosePaymentDialog();
            // Refresh payments or show success message
        };

        const getStatusColor = (status: string) => {
            switch (status) {
                case 'PAID': return 'success';
                case 'PENDING': return 'warning';
                case 'OVERDUE': return 'error';
                default: return 'default';
            }
        };

        const getStatusText = (status: string) => {
            switch (status) {
                case 'PAID': return 'Đã thanh toán';
                case 'PENDING': return 'Chờ thanh toán';
                case 'OVERDUE': return 'Quá hạn';
                default: return status;
            }
        };

        return (
            <Elements stripe={stripePromise}>
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
        disabled={payment.status === 'PAID'}
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

        <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận thanh toán</DialogTitle>
        <DialogContent>
        {selectedPayment && (
            <>
                <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
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
        <PaymentForm payment={selectedPayment} onSuccess={handleSuccess} onCancel={handleClosePaymentDialog} />
        </>
    )}
        </DialogContent>
        </Dialog>
        </Box>
        </Elements>
    );
    };

    export default Payments;