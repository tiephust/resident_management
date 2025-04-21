import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const TemporaryManagement = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'residence';

  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const ITEMS_PER_PAGE = 5;

  // Mock data
  const residenceData = [
    {
      id: 1,
      stt: 1,
      cccd: '012011234567',
      name: 'Lê Diễm Liên',
      gender: 'Nữ',
      address: 'Xã Bắc Phú, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 2,
      stt: 2,
      cccd: '023021987654',
      name: 'Dương Minh Thu',
      gender: 'Nữ',
      address: 'Xã Bắc Phú, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 3,
      stt: 3,
      cccd: '034032198765',
      name: 'Nguyễn Văn Cường',
      gender: 'Nam',
      address: 'Xã Đông Xuân, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 4,
      stt: 4,
      cccd: '045043219876',
      name: 'Trần Thị Dung',
      gender: 'Nữ',
      address: 'Xã Phú Minh, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 5,
      stt: 5,
      cccd: '056054321987',
      name: 'Phạm Văn Em',
      gender: 'Nam',
      address: 'Xã Tân Hưng, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 6,
      stt: 6,
      cccd: '067065432198',
      name: 'Hoàng Thị Phương',
      gender: 'Nữ',
      address: 'Xã Minh Phú, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 7,
      stt: 7,
      cccd: '078076543219',
      name: 'Vũ Văn Giang',
      gender: 'Nam',
      address: 'Xã Nam Sơn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 8,
      stt: 8,
      cccd: '089087654321',
      name: 'Mai Thị Hương',
      gender: 'Nữ',
      address: 'Xã Phù Liễn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 9,
      stt: 9,
      cccd: '090098765432',
      name: 'Đỗ Văn Inh',
      gender: 'Nam',
      address: 'Xã Bắc Sơn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 10,
      stt: 10,
      cccd: '101109876543',
      name: 'Lý Thị Kim',
      gender: 'Nữ',
      address: 'Xã Đông Xuân, Huyện Sóc Sơn, Hà Nội',
    },
  ];

  const leaveData = [
    {
      id: 1,
      stt: 1,
      cccd: '045678912345',
      name: 'Nguyễn Văn An',
      gender: 'Nam',
      address: 'Xã Nam Sơn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 2,
      stt: 2,
      cccd: '034567891234',
      name: 'Trần Thị Bình',
      gender: 'Nữ',
      address: 'Xã Phù Liễn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 3,
      stt: 3,
      cccd: '056789123456',
      name: 'Lê Văn Chính',
      gender: 'Nam',
      address: 'Xã Bắc Phú, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 4,
      stt: 4,
      cccd: '067891234567',
      name: 'Phạm Thị Diệu',
      gender: 'Nữ',
      address: 'Xã Tân Hưng, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 5,
      stt: 5,
      cccd: '078912345678',
      name: 'Hoàng Văn Đức',
      gender: 'Nam',
      address: 'Xã Minh Phú, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 6,
      stt: 6,
      cccd: '089123456789',
      name: 'Vũ Thị Hoa',
      gender: 'Nữ',
      address: 'Xã Đông Xuân, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 7,
      stt: 7,
      cccd: '091234567890',
      name: 'Đặng Văn Giang',
      gender: 'Nam',
      address: 'Xã Phú Minh, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 8,
      stt: 8,
      cccd: '012345678901',
      name: 'Ngô Thị Hương',
      gender: 'Nữ',
      address: 'Xã Nam Sơn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 9,
      stt: 9,
      cccd: '023456789012',
      name: 'Bùi Văn Khang',
      gender: 'Nam',
      address: 'Xã Bắc Sơn, Huyện Sóc Sơn, Hà Nội',
    },
    {
      id: 10,
      stt: 10,
      cccd: '034567890123',
      name: 'Mai Thị Lan',
      gender: 'Nữ',
      address: 'Xã Phù Liễn, Huyện Sóc Sơn, Hà Nội',
    },
  ];

  const allResidents = type === 'residence' ? residenceData : leaveData;

  // Filter residents based on search query and building
  const filteredResidents = useMemo(() => {
    return allResidents.filter((resident) => {
      const matchesSearch = searchQuery
        ? resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resident.cccd.includes(searchQuery)
        : true;
      
      const matchesBuilding = selectedBuilding === 'all' ? true : true; // Add building filter logic here

      return matchesSearch && matchesBuilding;
    });
  }, [allResidents, searchQuery, selectedBuilding]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResidents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResidents = filteredResidents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenDialog = (type: 'add' | 'edit' | 'view') => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDelete = (resident: any) => {
    setSelectedResident(resident);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // Add delete logic here
    setDeleteDialogOpen(false);
    setSelectedResident(null);
  };

  const getPageTitle = () => {
    return type === 'residence' ? 'Quản lý tạm trú' : 'Quản lý tạm vắng';
  };

  const getDialogTitle = () => {
    const actionText = {
      add: 'Thêm',
      edit: 'Chỉnh sửa',
      view: 'Chi tiết',
    }[dialogType];

    const typeText = type === 'residence' ? 'tạm trú' : 'tạm vắng';
    return `${actionText} thông tin ${typeText}`;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {getPageTitle()}
      </Typography>

      <Box sx={{ mb: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RadioGroup
            row
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="Cả 2 chung cư" />
            <FormControlLabel value="s1" control={<Radio />} label="S1" />
            <FormControlLabel value="s2" control={<Radio />} label="S2" />
          </RadioGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ minWidth: 150, height: 40 }}
            onClick={() => handleOpenDialog('add')}
          >
            Thêm
          </Button>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel size="small">Chọn tháng</InputLabel>
            <Select
              size="small"
              value={selectedMonth}
              label="Chọn tháng"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month}>Tháng {month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel size="small">Chọn năm</InputLabel>
            <Select
              size="small"
              value={selectedYear}
              label="Chọn năm"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          <TextField
            placeholder="Tên, CCCD, ..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ pl: 3 }} />
                <TableCell>STT</TableCell>
                <TableCell>CCCD</TableCell>
                <TableCell>Họ Tên</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Nơi thường trú</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>{resident.stt}</TableCell>
                  <TableCell>{resident.cccd}</TableCell>
                  <TableCell>{resident.name}</TableCell>
                  <TableCell>{resident.gender}</TableCell>
                  <TableCell>{resident.address}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      sx={{ color: '#2F80ED' }}
                      onClick={() => handleOpenDialog('view')}
                    >
                      Xem thêm
                    </Button>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog('edit')}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={() => handleDelete(resident)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="outlined"
              sx={{
                minWidth: '40px',
                px: 1,
                bgcolor: currentPage === page ? 'primary.main' : 'transparent',
                color: currentPage === page ? 'white' : 'primary.main',
                '&:hover': {
                  bgcolor: currentPage === page ? 'primary.dark' : 'transparent',
                },
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
          {getDialogTitle()}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                required
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CCCD"
                required
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  label="Giới tính"
                  disabled={dialogType === 'view'}
                  sx={dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Địa chỉ thường trú"
                multiline
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={type === 'residence' ? 'Địa chỉ tạm trú' : 'Địa chỉ nơi đến'}
                multiline
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do"
                multiline
                rows={2}
                InputProps={{
                  readOnly: dialogType === 'view',
                  sx: dialogType === 'view' ? { bgcolor: '#f5f5f5' } : {}
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            {dialogType === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {dialogType !== 'view' && (
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              {dialogType === 'add' ? 'Thêm' : 'Lưu thay đổi'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thông tin {type === 'residence' ? 'tạm trú' : 'tạm vắng'} của{' '}
            {selectedResident?.name} không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemporaryManagement; 