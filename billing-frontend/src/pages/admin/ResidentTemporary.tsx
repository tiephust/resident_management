import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';

interface TemporaryResident {
  id: number;
  fullName: string;
  idNumber: string;
  phoneNumber: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

const initialFormState: Omit<TemporaryResident, 'id' | 'status'> = {
  fullName: '',
  idNumber: '',
  phoneNumber: '',
  startDate: new Date(),
  endDate: new Date(),
  reason: '',
  notes: '',
};

const ResidentTemporary: React.FC = () => {
  const [residents, setResidents] = useState<TemporaryResident[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenDialog = (resident?: TemporaryResident) => {
    if (resident) {
      setEditingId(resident.id);
      setFormData({
        fullName: resident.fullName,
        idNumber: resident.idNumber,
        phoneNumber: resident.phoneNumber,
        startDate: resident.startDate,
        endDate: resident.endDate,
        reason: resident.reason,
        notes: resident.notes || '',
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setDialogOpen(true);
    setErrors({});
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'Số CMND/CCCD không được để trống';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Lý do không được để trống';
    }
    if (formData.endDate < formData.startDate) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId === null) {
      // Add new resident
      const newResident: TemporaryResident = {
        id: residents.length + 1,
        ...formData,
        status: 'pending',
      };
      setResidents([...residents, newResident]);
    } else {
      // Update existing resident
      setResidents(residents.map(resident =>
        resident.id === editingId
          ? { ...resident, ...formData }
          : resident
      ));
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khai báo này không?')) {
      setResidents(residents.filter(resident => resident.id !== id));
    }
  };

  const getStatusChip = (status: TemporaryResident['status']) => {
    const statusConfig = {
      pending: { color: 'warning' as const, label: 'Chờ duyệt' },
      approved: { color: 'success' as const, label: 'Đã duyệt' },
      rejected: { color: 'error' as const, label: 'Từ chối' },
    };

    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Quản lý tạm trú</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm khai báo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>CMND/CCCD</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.fullName}</TableCell>
                <TableCell>{resident.idNumber}</TableCell>
                <TableCell>{resident.phoneNumber}</TableCell>
                <TableCell>
                  {resident.startDate.toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  {resident.endDate.toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>{resident.reason}</TableCell>
                <TableCell>{getStatusChip(resident.status)}</TableCell>
                <TableCell>{resident.notes}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(resident)}
                    disabled={resident.status !== 'pending'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(resident.id)}
                    disabled={resident.status !== 'pending'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId === null ? 'Thêm khai báo tạm trú' : 'Chỉnh sửa khai báo tạm trú'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Họ tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CMND/CCCD"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={formData.startDate}
                  onChange={(date: Date | null) => date && setFormData({ ...formData, startDate: date })}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: { fullWidth: true, required: true }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.endDate}
                  onChange={(date: Date | null) => date && setFormData({ ...formData, endDate: date })}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                error={!!errors.reason}
                helperText={errors.reason}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingId === null ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResidentTemporary; 