import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import vi from 'date-fns/locale/vi';

interface TemporaryResident {
  id: string;
  fullName: string;
  idNumber: string;
  phoneNumber: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

const Temporary = () => {
  const [residents, setResidents] = useState<TemporaryResident[]>([
    {
      id: '1',
      fullName: 'Nguyễn Văn A',
      idNumber: '123456789012',
      phoneNumber: '0987654321',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      reason: 'Thăm người thân',
      status: 'approved',
      note: 'Đã duyệt',
    },
    {
      id: '2',
      fullName: 'Trần Thị B',
      idNumber: '098765432109',
      phoneNumber: '0123456789',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-10'),
      reason: 'Công tác',
      status: 'pending',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<TemporaryResident | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    reason: '',
  });

  const handleOpenDialog = (resident?: TemporaryResident) => {
    if (resident) {
      setSelectedResident(resident);
      setFormData({
        fullName: resident.fullName,
        idNumber: resident.idNumber,
        phoneNumber: resident.phoneNumber,
        startDate: resident.startDate,
        endDate: resident.endDate,
        reason: resident.reason,
      });
    } else {
      setSelectedResident(null);
      setFormData({
        fullName: '',
        idNumber: '',
        phoneNumber: '',
        startDate: null,
        endDate: null,
        reason: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResident(null);
    setFormData({
      fullName: '',
      idNumber: '',
      phoneNumber: '',
      startDate: null,
      endDate: null,
      reason: '',
    });
  };

  const handleSubmit = () => {
    const { fullName, idNumber, phoneNumber, startDate, endDate, reason } = formData;
    if (!fullName || !idNumber || !phoneNumber || !startDate || !endDate || !reason) return;

    if (selectedResident) {
      // Edit existing resident
      setResidents(residents.map(r =>
        r.id === selectedResident.id
          ? { ...r, fullName, idNumber, phoneNumber, startDate, endDate, reason }
          : r
      ));
    } else {
      // Add new resident
      const newResident: TemporaryResident = {
        id: Date.now().toString(),
        fullName,
        idNumber,
        phoneNumber,
        startDate,
        endDate,
        reason,
        status: 'pending',
      };
      setResidents([...residents, newResident]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setResidents(residents.filter(r => r.id !== id));
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Khai báo tạm trú</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm khai báo
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>CCCD/CMND</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Lý do</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
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
                    <TableCell>
                      <Chip
                        label={getStatusText(resident.status)}
                        color={getStatusColor(resident.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{resident.note || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(resident)}
                        disabled={resident.status !== 'pending'}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(resident.id)}
                        disabled={resident.status !== 'pending'}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedResident ? 'Sửa khai báo tạm trú' : 'Thêm khai báo tạm trú'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CCCD/CMND"
                  value={formData.idNumber}
                  onChange={handleInputChange('idNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={formData.startDate}
                  onChange={(newValue: Date | null) => setFormData({ ...formData, startDate: newValue })}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.endDate}
                  onChange={(newValue: Date | null) => setFormData({ ...formData, endDate: newValue })}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lý do"
                  value={formData.reason}
                  onChange={handleInputChange('reason')}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.fullName ||
              !formData.idNumber ||
              !formData.phoneNumber ||
              !formData.startDate ||
              !formData.endDate ||
              !formData.reason
            }
          >
            {selectedResident ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Temporary; 