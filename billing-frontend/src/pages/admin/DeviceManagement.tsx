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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DeviceDialog from '../../components/admin/DeviceDialog';
import { Device, NewDevice } from '../../types/admin/DeviceManagementType';
import { deviceService } from '../../services/admin/deviceService';

const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | NewDevice | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await deviceService.getAllDevices();
      setDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const handleOpen = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
    } else {
      setEditingDevice({
        name: '',
        type: '',
        status: 'ACTIVE',
        maintenanceAt: new Date().toISOString().split('T')[0],
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
        // editingDevice is of type Device (has id)
        await deviceService.updateDevice(editingDevice.id, editingDevice as NewDevice);
      } else if (editingDevice) {
        // editingDevice is of type NewDevice (no id)
        await deviceService.createDevice(editingDevice as NewDevice);
      }
      handleClose();
      loadDevices();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deviceService.deleteDevice(id);
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
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

  return (
      <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
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
                      <TableCell>{device.maintenanceAt}</TableCell>
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
        />
      </Box>
  );
};

export default DeviceManagement;