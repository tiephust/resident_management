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
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import PageTemplate from '../../components/PageTemplate';
import { feeService } from '../../services/admin/feeService';
import { FeeDTO } from '../../types/fee';

const AdminPayments: React.FC = () => {
    const [payments, setPayments] = useState<FeeDTO[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [residentFilter, setResidentFilter] = useState<string>('');

    useEffect(() => {
        fetchPayments();
    }, [statusFilter, residentFilter]);

    const fetchPayments = async () => {
        try {
            const data = await feeService.getPayments(statusFilter, residentFilter);
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const handleRefund = async (feeId: string, paymentIntentId: string) => {
        try {
            await feeService.processRefund(Number(feeId), paymentIntentId);
            fetchPayments();
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'UNPAID': return 'warning';
            case 'OVERDUE': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID': return 'Đã thanh toán';
            case 'UNPAID': return 'Chưa thanh toán';
            case 'OVERDUE': return 'Quá hạn';
            default: return status;
        }
    };

    return (
        <PageTemplate title="Quản lý thanh toán">
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý thanh toán
                </Typography>

                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Trạng thái"
                        >
                            <MenuItem value="ALL">Tất cả</MenuItem>
                            <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                            <MenuItem value="PAID">Đã thanh toán</MenuItem>
                            <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Tìm kiếm cư dân"
                        value={residentFilter}
                        onChange={(e) => setResidentFilter(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cư dân</TableCell>
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
                                    <TableCell>{payment.residentName}</TableCell>
                                    <TableCell>{payment.feeTypeName}</TableCell>
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
                                        {payment.status === 'PAID' && payment.stripePaymentIntentId && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<ReceiptIcon />}
                                                onClick={() => handleRefund(payment.id, payment.stripePaymentIntentId!)}
                                            >
                                                Hoàn tiền
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </PageTemplate>
    );
};

export default AdminPayments;