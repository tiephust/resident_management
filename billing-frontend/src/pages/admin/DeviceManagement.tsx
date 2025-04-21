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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Device {
  id: number;
  name: string;
  type: string;
  status: 'Hoạt động' | 'Bảo trì' | 'Hỏng';
  location: string;
  lastMaintenance: string;
}

const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: 'Máy bơm nước',
      type: 'Thiết bị điện',
      status: 'Hoạt động',
      location: 'Tầng hầm - S1',
      lastMaintenance: '15/02/2024',
    },
    {
      id: 2,
      name: 'Camera an ninh',
      type: 'Thiết bị giám sát',
      status: 'Hoạt động',
      location: 'Sảnh - S1',
      lastMaintenance: '20/02/2024',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const handleOpen = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
    } else {
      setEditingDevice(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDevice(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'Bảo trì':
        return { bg: '#FFF3E0', color: '#E65100' };
      case 'Hỏng':
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
                <TableCell>Vị trí</TableCell>
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
                      label={device.status}
                      sx={{
                        bgcolor: getStatusColor(device.status).bg,
                        color: getStatusColor(device.status).color,
                      }}
                    />
                  </TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>{device.lastMaintenance}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(device)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDevice ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tên thiết bị"
              fullWidth
              defaultValue={editingDevice?.name}
            />
            <TextField
              label="Loại thiết bị"
              fullWidth
              defaultValue={editingDevice?.type}
            />
            <TextField
              label="Vị trí"
              fullWidth
              defaultValue={editingDevice?.location}
            />
            <TextField
              label="Ngày bảo trì gần nhất"
              fullWidth
              type="date"
              defaultValue={editingDevice?.lastMaintenance}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleClose}>
            {editingDevice ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManagement; 