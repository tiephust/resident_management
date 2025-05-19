// components/admin/DeviceManagement.tsx
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
  IconButton,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DeviceDialog from '../../components/admin/DeviceDialog';
import { Device, NewDevice, Apartment } from '../../types/admin/DeviceManagementType';
import { deviceService } from '../../services/admin/deviceService';

const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | NewDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    loadDevices();
    loadApartments();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await deviceService.getAllDevices();
      setDevices(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Lỗi khi tải danh sách thiết bị');
        console.error('Error loading devices:', err);
      }
    }
  };

  const loadApartments = async () => {
    try {
      const data = await deviceService.getAllApartments();
      setApartments(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Lỗi khi tải danh sách căn hộ');
        console.error('Error loading apartments:', err);
      }
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getApartmentLabel = (apartmentId?: number) => {
    if (!apartmentId) return '-';
    const apartment = apartments.find(a => a.id === apartmentId);
    return apartment ? apartment.name : '-';
  };

  const handleOpen = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
    } else {
      setEditingDevice({
        name: '',
        type: '',
        status: 'ACTIVE',
        maintenanceAt: new Date().toISOString(),
        description: '',
        numberCard: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDevice(null);
  };

  const handleSave = async () => {
    try {
      if (editingDevice && 'id' in editingDevice) {
        await deviceService.updateDevice(editingDevice.id, editingDevice as NewDevice);
        setSnackbar({ open: true, message: 'Cập nhật thiết bị thành công' });
      } else if (editingDevice) {
        await deviceService.createDevice(editingDevice as NewDevice);
        setSnackbar({ open: true, message: 'Thêm thiết bị thành công' });
      }
      handleClose();
      loadDevices();
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        throw err; // Let DeviceDialog handle the error
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deviceService.deleteDevice(id);
      setSnackbar({ open: true, message: 'Xóa thiết bị thành công' });
      loadDevices();
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Lỗi khi xóa thiết bị');
        console.error('Error deleting device:', err);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý thiết bị
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm thiết bị
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên thiết bị</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Số thẻ</TableCell>
                <TableCell>Căn hộ</TableCell>
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
                  <TableCell>{getApartmentLabel(device.apartmentId)}</TableCell>
                  <TableCell>{formatDateForDisplay(device.maintenanceAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(device)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(device.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <DeviceDialog
        open={open}
        device={editingDevice}
        setDevice={setEditingDevice}
        onClose={handleClose}
        onSave={handleSave}
        apartments={apartments}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default DeviceManagement;