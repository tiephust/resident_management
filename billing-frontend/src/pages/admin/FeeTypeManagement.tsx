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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface FeeType {
  id: number;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  billingCycle: string;
  description: string;
}

const FeeTypeManagement = () => {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([
    {
      id: 1,
      name: 'Tiền nước',
      category: 'Dịch vụ cơ bản',
      unit: 'm³',
      pricePerUnit: 15000,
      billingCycle: 'Hàng tháng',
      description: 'Phí sử dụng nước sinh hoạt',
    },
    {
      id: 2,
      name: 'Tiền điện',
      category: 'Dịch vụ cơ bản',
      unit: 'kWh',
      pricePerUnit: 3500,
      billingCycle: 'Hàng tháng',
      description: 'Phí sử dụng điện',
    },
    {
      id: 3,
      name: 'Phí vệ sinh',
      category: 'Dịch vụ chung',
      unit: 'Căn hộ',
      pricePerUnit: 100000,
      billingCycle: 'Hàng tháng',
      description: 'Phí dịch vụ vệ sinh chung cư',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);

  const handleOpen = (feeType?: FeeType) => {
    if (feeType) {
      setEditingFeeType(feeType);
    } else {
      setEditingFeeType(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFeeType(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý loại phí
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm loại phí
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên loại phí</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Đơn vị tính</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Chu kỳ thu</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeTypes.map((feeType) => (
                <TableRow key={feeType.id}>
                  <TableCell>{feeType.name}</TableCell>
                  <TableCell>{feeType.category}</TableCell>
                  <TableCell>{feeType.unit}</TableCell>
                  <TableCell>{formatCurrency(feeType.pricePerUnit)} VNĐ/{feeType.unit}</TableCell>
                  <TableCell>{feeType.billingCycle}</TableCell>
                  <TableCell>{feeType.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(feeType)} color="primary">
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
          {editingFeeType ? 'Chỉnh sửa loại phí' : 'Thêm loại phí mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tên loại phí"
              fullWidth
              defaultValue={editingFeeType?.name}
            />
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                defaultValue={editingFeeType?.category || ''}
                label="Danh mục"
              >
                <MenuItem value="Dịch vụ cơ bản">Dịch vụ cơ bản</MenuItem>
                <MenuItem value="Dịch vụ chung">Dịch vụ chung</MenuItem>
                <MenuItem value="Phí quản lý">Phí quản lý</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Đơn vị tính"
              fullWidth
              defaultValue={editingFeeType?.unit}
              helperText="Ví dụ: m³, kWh, căn hộ, người"
            />
            <TextField
              label="Đơn giá"
              fullWidth
              type="number"
              defaultValue={editingFeeType?.pricePerUnit}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Chu kỳ thu</InputLabel>
              <Select
                defaultValue={editingFeeType?.billingCycle || ''}
                label="Chu kỳ thu"
              >
                <MenuItem value="Hàng tháng">Hàng tháng</MenuItem>
                <MenuItem value="Hàng quý">Hàng quý</MenuItem>
                <MenuItem value="Hàng năm">Hàng năm</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              defaultValue={editingFeeType?.description}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleClose}>
            {editingFeeType ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeeTypeManagement; 