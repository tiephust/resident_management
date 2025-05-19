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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ApartmentDetail, Vehicle } from '../../types/admin/ApartmentManagementType';
import { Device } from '../../types/admin/DeviceManagementType';

interface ApartmentDetailsDialogProps {
    open: boolean;
    apartment: ApartmentDetail | null;
    devices: Device[];
    onClose: () => void;
    onSave: () => void;
    onAddVehicle: () => void;
    onEditVehicle: (vehicle: Vehicle) => void;
    onDeleteVehicle: (vehicle: Vehicle) => void;
    onAddDevice: () => void;
}

const ApartmentDetailsDialog: React.FC<ApartmentDetailsDialogProps> = ({
    open,
    apartment,
    devices,
    onClose,
    onSave,
    onAddVehicle,
    onEditVehicle,
    onDeleteVehicle,
    onAddDevice,
}) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Chi tiết căn hộ {apartment?.building} - {apartment?.name}
            </DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tab label="Thông tin cơ bản" />
                    <Tab label="Phương tiện" />
                    <Tab label="Thiết bị" />
                    <Tab label="Ghi chú" />
                </Tabs>

                {tabValue === 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Số căn hộ"
                                fullWidth
                                value={apartment?.name}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Tòa nhà"
                                fullWidth
                                value={apartment?.building}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Tầng"
                                fullWidth
                                value={apartment?.floor}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                label="Chủ căn hộ"
                                fullWidth
                                value={apartment?.ownerName}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Số người ở"
                                fullWidth
                                type="number"
                                value={apartment?.numResidents}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Số chìa khóa"
                                fullWidth
                                type="number"
                                value={apartment?.numKeys}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Số chỗ để xe máy"
                                fullWidth
                                type="number"
                                value={apartment?.parkingSlots?.bike}
                                disabled
                            />
                        </Grid>
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Danh sách phương tiện
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={onAddVehicle}
                            >
                                Thêm phương tiện
                            </Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Loại</TableCell>
                                        <TableCell>Biển số</TableCell>
                                        <TableCell>Hãng xe</TableCell>
                                        <TableCell>Màu sắc</TableCell>
                                        <TableCell align="right">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {apartment?.vehicles?.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.type}</TableCell>
                                            <TableCell>{vehicle.licensePlate}</TableCell>
                                            <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                                            <TableCell>{vehicle.color}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => onEditVehicle(vehicle)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDeleteVehicle(vehicle)}
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
                                        <TableCell>Ngày bảo trì</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {devices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell>{device.name}</TableCell>
                                            <TableCell>{device.type}</TableCell>
                                            <TableCell>{device.status}</TableCell>
                                            <TableCell>{device.maintenanceAt}</TableCell>
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