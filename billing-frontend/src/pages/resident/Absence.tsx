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

interface AbsenceDeclaration {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

const Absence = () => {
  const [declarations, setDeclarations] = useState<AbsenceDeclaration[]>([
    {
      id: '1',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      reason: 'Về quê ăn Tết',
      status: 'approved',
      note: 'Đã duyệt',
    },
    {
      id: '2',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-10'),
      reason: 'Công tác nước ngoài',
      status: 'pending',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<AbsenceDeclaration | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');

  const handleOpenDialog = (declaration?: AbsenceDeclaration) => {
    if (declaration) {
      setSelectedDeclaration(declaration);
      setStartDate(declaration.startDate);
      setEndDate(declaration.endDate);
      setReason(declaration.reason);
    } else {
      setSelectedDeclaration(null);
      setStartDate(null);
      setEndDate(null);
      setReason('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDeclaration(null);
    setStartDate(null);
    setEndDate(null);
    setReason('');
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) return;

    if (selectedDeclaration) {
      // Edit existing declaration
      setDeclarations(declarations.map(d =>
        d.id === selectedDeclaration.id
          ? { ...d, startDate, endDate, reason }
          : d
      ));
    } else {
      // Add new declaration
      const newDeclaration: AbsenceDeclaration = {
        id: Date.now().toString(),
        startDate,
        endDate,
        reason,
        status: 'pending',
      };
      setDeclarations([...declarations, newDeclaration]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setDeclarations(declarations.filter(d => d.id !== id));
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
            <Typography variant="h4">Khai báo tạm vắng</Typography>
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
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Lý do</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {declarations.map((declaration) => (
                  <TableRow key={declaration.id}>
                    <TableCell>
                      {declaration.startDate.toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {declaration.endDate.toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>{declaration.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(declaration.status)}
                        color={getStatusColor(declaration.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{declaration.note || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(declaration)}
                        disabled={declaration.status !== 'pending'}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(declaration.id)}
                        disabled={declaration.status !== 'pending'}
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
          {selectedDeclaration ? 'Sửa khai báo tạm vắng' : 'Thêm khai báo tạm vắng'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDate}
                  onChange={(newValue: Date | null) => setStartDate(newValue)}
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
                  value={endDate}
                  onChange={(newValue: Date | null) => setEndDate(newValue)}
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
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
            disabled={!startDate || !endDate || !reason}
          >
            {selectedDeclaration ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Absence; 