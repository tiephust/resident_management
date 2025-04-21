import React, { useState, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface FeeRecord {
  id: number;
  stt: number;
  tenChuHo: string;
  tenDichVu: string;
  loaiDichVu: string;
  hanDong: string;
  soTien: number;
  tinhTrang: 'Đã đóng' | 'Chưa đóng';
}

const FeeManagementPage = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedService, setSelectedService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // Mock data
  const feeRecords: FeeRecord[] = [
    {
      id: 1,
      stt: 1,
      tenChuHo: 'Nguyễn Thu Trang',
      tenDichVu: 'Dịch vụ nước',
      loaiDichVu: 'Dịch Vụ Cơ Bản',
      hanDong: '12/1/2023',
      soTien: 1259000,
      tinhTrang: 'Đã đóng',
    },
    {
      id: 2,
      stt: 2,
      tenChuHo: 'Phạm Văn Cường',
      tenDichVu: 'Dịch vụ điện',
      loaiDichVu: 'Dịch Vụ Cơ Bản',
      hanDong: '1/2/2023',
      soTien: 240000,
      tinhTrang: 'Đã đóng',
    },
    {
      id: 3,
      stt: 3,
      tenChuHo: 'Đỗ Văn Đức',
      tenDichVu: 'Dịch vụ Internet',
      loaiDichVu: 'Dịch Vụ Cơ Bản',
      hanDong: '3/5/2023',
      soTien: 530000,
      tinhTrang: 'Đã đóng',
    },
    {
      id: 4,
      stt: 4,
      tenChuHo: 'Nguyễn Văn Hải',
      tenDichVu: 'Dịch vụ An ninh',
      loaiDichVu: 'Dịch Vụ An Ninh và Bảo Vệ',
      hanDong: '1/10/2023',
      soTien: 260000,
      tinhTrang: 'Đã đóng',
    },
    {
      id: 5,
      stt: 5,
      tenChuHo: 'Phạm Văn Tài',
      tenDichVu: 'Gửi xe máy',
      loaiDichVu: 'Dịch Vụ Gửi Xe và Đỗ Xe',
      hanDong: '2/11/2023',
      soTien: 60000,
      tinhTrang: 'Chưa đóng',
    },
  ];

  // Filter records based on search query and filters
  const filteredRecords = useMemo(() => {
    return feeRecords.filter((record) => {
      const matchesSearch = searchQuery
        ? record.tenChuHo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.tenDichVu.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesBuilding = selectedBuilding === 'all' ? true : true; // Add building filter logic
      const matchesService = selectedService ? record.tenDichVu === selectedService : true;

      return matchesSearch && matchesBuilding && matchesService;
    });
  }, [feeRecords, searchQuery, selectedBuilding, selectedService]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Quản lý đóng phí
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
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: 40 }}
          >
            Thêm khoản phí
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Chọn loại dịch vụ</InputLabel>
            <Select
              value={selectedService}
              label="Chọn loại dịch vụ"
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <MenuItem value="Dịch vụ nước">Dịch vụ nước</MenuItem>
              <MenuItem value="Dịch vụ điện">Dịch vụ điện</MenuItem>
              <MenuItem value="Dịch vụ Internet">Dịch vụ Internet</MenuItem>
              <MenuItem value="Dịch vụ An ninh">Dịch vụ An ninh</MenuItem>
              <MenuItem value="Gửi xe máy">Gửi xe máy</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Chọn tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Chọn tháng"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month}>Tháng {month}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Chọn năm</InputLabel>
            <Select
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
            placeholder="Tên chủ hộ, tên dịch vụ"
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
                <TableCell>STT</TableCell>
                <TableCell>Tên chủ hộ</TableCell>
                <TableCell>Tên dịch vụ</TableCell>
                <TableCell>Loại dịch vụ</TableCell>
                <TableCell>Hạn đóng</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Tình trạng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.stt}</TableCell>
                  <TableCell>{record.tenChuHo}</TableCell>
                  <TableCell>{record.tenDichVu}</TableCell>
                  <TableCell>{record.loaiDichVu}</TableCell>
                  <TableCell>{record.hanDong}</TableCell>
                  <TableCell>{formatCurrency(record.soTien)}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.tinhTrang}
                      color={record.tinhTrang === 'Đã đóng' ? 'info' : 'error'}
                      sx={{
                        bgcolor: record.tinhTrang === 'Đã đóng' ? '#E8F5E9' : '#FFEBEE',
                        color: record.tinhTrang === 'Đã đóng' ? '#2E7D32' : '#C62828',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            sx={{ minWidth: '40px', px: 1 }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            ←
          </Button>
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
          <Button
            variant="outlined"
            sx={{ minWidth: '40px', px: 1 }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeeManagementPage; 