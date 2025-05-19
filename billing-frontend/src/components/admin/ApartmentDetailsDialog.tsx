import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    Box,
    Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ApartmentDTO } from '../../types/admin/ApartmentServiceType';
import { Device } from '../../types/admin/DeviceManagementType';
import { Fee } from '../../types/admin/FeeManagementType';

interface ApartmentDetailsDialogProps {
    open: boolean;
    apartment: ApartmentDTO | null;
    devices: Device[];
    fees: Fee[];
    onClose: () => void;
    onSave: () => void;
    onAddDevice: () => void;
    onEditDevice: (device: Device) => void;
    onDeleteDevice: (device: Device) => void;
    onAddFee: () => void;
    onEditFee: (fee: Fee) => void;
    onDeleteFee: (fee: Fee) => void;
}

const ApartmentDetailsDialog: React.FC<ApartmentDetailsDialogProps> = ({
    open,
    apartment,
    devices,
    fees,
    onClose,
    onSave,
    onAddDevice,
    onEditDevice,
    onDeleteDevice,
    onAddFee,
    onEditFee,
    onDeleteFee,
}) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Hoạt động';
            case 'MAINTENANCE': return 'Bảo trì';
            case 'BROKEN': return 'Hỏng';
            default: return 'Hoạt động';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { bg: '#E8F5E9', color: '#2E7D32' };
            case 'MAINTENANCE':
                return { bg: '#FFF3E0', color: '#E65100' };
            case 'BROKEN':
                return { bg: '#FFEBEE', color: '#C62828' };
            default:
                return { bg: '#E8F5E9', color: '#2E7D32' };
        }
    };

    const getFeeStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return 'Đã đóng';
            case 'UNPAID': return 'Chưa đóng';
            case 'OVERDUE': return 'Quá hạn';
            default: return 'Chưa đóng';
        }
    };

    const getFeeStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return { bg: '#E8F5E9', color: '#2E7D32' };
            case 'UNPAID':
                return { bg: '#FFF3E0', color: '#E65100' };
            case 'OVERDUE':
                return { bg: '#FFEBEE', color: '#C62828' };
            default:
                return { bg: '#FFF3E0', color: '#E65100' };
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Chi tiết căn hộ {apartment?.name}
            </DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tab label="Thông tin cơ bản" />
                    <Tab label="Thiết bị" />
                    <Tab label="Phí" />
                    <Tab label="Ghi chú" />
                </Tabs>

                {tabValue === 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên căn hộ"
                                fullWidth
                                value={apartment?.name}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="ID chủ căn hộ"
                                fullWidth
                                value={apartment?.apartmentOwnerId}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ngày tạo"
                                fullWidth
                                value={formatDate(apartment?.createdAt)}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Ngày cập nhật"
                                fullWidth
                                value={formatDate(apartment?.updatedAt)}
                                disabled
                            />
                        </Grid>
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Danh sách thiết bị
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={onAddDevice}
                            >
                                Thêm thiết bị
                            </Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên thiết bị</TableCell>
                                        <TableCell>Loại thiết bị</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Số thẻ</TableCell>
                                        <TableCell>Bảo trì gần nhất</TableCell>
                                        <TableCell align="right">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {devices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell>{device.name}</TableCell>
                                            <TableCell>{device.type}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(device.status)}
                                                    sx={{
                                                        bgcolor: getStatusColor(device.status).bg,
                                                        color: getStatusColor(device.status).color,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{device.numberCard || '-'}</TableCell>
                                            <TableCell>{formatDate(device.maintenanceAt)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => onEditDevice(device)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDeleteDevice(device)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {tabValue === 2 && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Danh sách phí
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={onAddFee}
                            >
                                Thêm phí
                            </Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Loại phí</TableCell>
                                        <TableCell>Số tiền</TableCell>
                                        <TableCell>Hạn đóng</TableCell>
                                        <TableCell>Ngày đóng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="right">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fees.map((fee) => (
                                        <TableRow key={fee.id}>
                                            <TableCell>{fee.feeTypeId}</TableCell>
                                            <TableCell>{formatCurrency(fee.amount)}</TableCell>
                                            <TableCell>{formatDate(fee.dueDate)}</TableCell>
                                            <TableCell>{formatDate(fee.paymentDate)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getFeeStatusLabel(fee.status)}
                                                    sx={{
                                                        bgcolor: getFeeStatusColor(fee.status).bg,
                                                        color: getFeeStatusColor(fee.status).color,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => onEditFee(fee)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDeleteFee(fee)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {tabValue === 3 && (
                    <TextField
                        label="Ghi chú"
                        fullWidth
                        multiline
                        rows={4}
                        value={apartment?.description || ''}
                        disabled
                        sx={{ mt: 2 }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
                <Button variant="contained" onClick={onSave}>
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApartmentDetailsDialog;