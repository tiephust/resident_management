import React, { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ApartmentDTO } from '../../types/admin/ApartmentServiceType';
import { Device } from '../../types/admin/DeviceManagementType';
import { Fee } from '../../types/admin/FeeManagementType';
import { Resident } from '../../types/admin/ResidentManagementType';
import { managementResidentService } from '../../services/admin/ManagementResidentService';
import AddResidentDialog from './AddResidentDialog';
import TempResidenceDialog from './TempResidenceDialog';
import TempLeaveDialog from './TempLeaveDialog';
import EditResidentDialog from './EditResidentDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

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
    onUpdateApartment: (apartment: ApartmentDTO) => void;
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
    onUpdateApartment,
}) => {
    const [tabValue, setTabValue] = useState(0);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [addResidentDialog, setAddResidentDialog] = useState(false);
    const [tempResidenceDialog, setTempResidenceDialog] = useState(false);
    const [tempLeaveDialog, setTempLeaveDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        const loadResidents = async () => {
            if (open) {
                try {
                    setLoading(true);
                    const data = await managementResidentService.getAllResidents();
                    setResidents(data);
                } catch (error) {
                    console.error('Error loading residents:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadResidents();
    }, [open]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleApartmentOwnerChange = (event: SelectChangeEvent<number>) => {
        if (apartment) {
            const updatedApartment = {
                ...apartment,
                apartmentOwnerId: event.target.value as number
            };
            onUpdateApartment(updatedApartment);
        }
    };

    const handleOpenAddDialog = () => {
        setSelectedResident({
            name: '',
            email: '',
            phoneNumber: '',
            unitNumber: '',
            department: '',
            leaseStartDate: '',
            leaseEndDate: '',
            role: 'RESIDENT',
            password: '1',
            gender: '',
            hometown: '',
            address: '',
            description: '',
            birthday: '',
            stripeCustomerId: '',
            isActive: true,
            apartmentId: apartment?.id
        });
        setAddResidentDialog(true);
    };

    const handleOpenTempResidenceDialog = () => {
        setSelectedResident({
            name: '',
            email: '',
            phoneNumber: '',
            unitNumber: '',
            department: '',
            leaseStartDate: '',
            leaseEndDate: '',
            role: 'TEMPORARY',
            password: '1',
            gender: '',
            hometown: '',
            address: '',
            description: '',
            birthday: '',
            stripeCustomerId: '',
            isActive: true,
            apartmentId: apartment?.id
        });
        setTempResidenceDialog(true);
    };

    const handleOpenEditDialog = (resident: Resident) => {
        setSelectedResident(resident);
        setEditDialog(true);
    };

    const handleOpenDeleteDialog = (resident: Resident) => {
        setSelectedResident(resident);
        setDeleteDialog(true);
    };

    const handleOpenTempLeaveDialog = (resident: Resident) => {
        setSelectedResident(resident);
        setTempLeaveDialog(true);
    };

    const handleCloseDialog = () => {
        setAddResidentDialog(false);
        setTempResidenceDialog(false);
        setTempLeaveDialog(false);
        setEditDialog(false);
        setDeleteDialog(false);
        setSelectedResident(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false);
        setSelectedResident(null);
    };

    const handleSaveResident = async () => {
        try {
            if (selectedResident) {
                const { password, ...residentData } = selectedResident;
                if ('id' in selectedResident && selectedResident.id) {
                    await managementResidentService.updateResident(selectedResident.id, residentData);
                } else {
                    await managementResidentService.createResident(residentData);
                }
                const data = await managementResidentService.getAllResidents();
                setResidents(data);
                handleCloseDialog();
            }
        } catch (error) {
            console.error('Lỗi khi lưu cư dân:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedResident && 'id' in selectedResident) {
                await managementResidentService.deleteResident(selectedResident.id);
                const data = await managementResidentService.getAllResidents();
                setResidents(data);
                handleCloseDeleteDialog();
            }
        } catch (error) {
            console.error('Lỗi khi xóa cư dân:', error);
        }
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
                    <Tab label="Cư dân" />
                    <Tab label="Ghi chú" />
                </Tabs>

                {tabValue === 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên căn hộ"
                                fullWidth
                                value={apartment?.name}
                                // disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Chủ căn hộ</InputLabel>
                                <Select
                                    value={apartment?.apartmentOwnerId || ''}
                                    label="Chủ căn hộ"
                                    onChange={handleApartmentOwnerChange}
                                >
                                    {residents.map((resident) => (
                                        <MenuItem key={resident.id} value={resident.id}>
                                            {resident.name} - {resident.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddDialog}
                            >
                                Thêm cư dân
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={handleOpenTempResidenceDialog}
                            >
                                Khai báo tạm trú
                            </Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                        <TableCell>Vai trò</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="right">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {residents
                                        .filter(resident => resident.apartmentId === apartment?.id)
                                        .map((resident) => (
                                            <TableRow key={resident.id}>
                                                <TableCell>{resident.name}</TableCell>
                                                <TableCell>{resident.email}</TableCell>
                                                <TableCell>{resident.phoneNumber}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={resident.role === 'RESIDENT' ? 'Cư dân' : 'Tạm trú'}
                                                        color={resident.role === 'RESIDENT' ? 'primary' : 'secondary'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={resident.isActive ? 'Đang ở' : 'Đã rời'}
                                                        color={resident.isActive ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(resident)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEditDialog(resident)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleOpenTempLeaveDialog(resident)}
                                                    >
                                                        Thêm tạm vắng
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {tabValue === 4 && (
                    <TextField
                        label="Ghi chú"
                        fullWidth
                        multiline
                        rows={4}
                        value={apartment?.description || ''}
                        // disabled
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

            <AddResidentDialog
                open={addResidentDialog}
                resident={selectedResident}
                setResident={setSelectedResident}
                onClose={handleCloseDialog}
                onSave={handleSaveResident}
            />
            <TempResidenceDialog
                open={tempResidenceDialog}
                resident={selectedResident}
                setResident={setSelectedResident}
                onClose={handleCloseDialog}
                onSave={handleSaveResident}
            />
            <TempLeaveDialog
                open={tempLeaveDialog}
                resident={selectedResident}
                onClose={handleCloseDialog}
            />
            <EditResidentDialog
                open={editDialog}
                resident={selectedResident}
                setResident={setSelectedResident}
                onClose={handleCloseDialog}
                onSave={handleSaveResident}
            />
            <DeleteConfirmationDialog
                open={deleteDialog}
                title="Xác nhận xóa cư dân"
                content={`Bạn có chắc chắn muốn xóa cư dân ${selectedResident?.name} không?`}
                onClose={handleCloseDeleteDialog}
                onDelete={handleDelete}
            />
        </Dialog>
    );
};

export default ApartmentDetailsDialog;