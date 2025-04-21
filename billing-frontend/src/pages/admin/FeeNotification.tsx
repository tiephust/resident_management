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
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface FeeNotificationRecord {
  id: number;
  stt: number;
  tenChuHo: string;
  tenDichVu: string;
  tenCanHo: string;
  thoiGian: string;
  soTien: number;
}

const FeeNotification = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedService, setSelectedService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // Mock data
  const notificationRecords: FeeNotificationRecord[] = [
    {
      id: 1,
      stt: 1,
      tenChuHo: 'Đỗ Văn Đức',
      tenDichVu: 'Điện',
      tenCanHo: '11',
      thoiGian: '1/2023',
      soTien: 1259000,
    },
    {
      id: 2,
      stt: 2,
      tenChuHo: 'Nguyễn Văn Hải',
      tenDichVu: 'Nước',
      tenCanHo: '12',
      thoiGian: '2/2023',
      soTien: 240000,
    },
    {
      id: 3,
      stt: 3,
      tenChuHo: 'Trần Thị Thơ',
      tenDichVu: 'Bảo trì',
      tenCanHo: '13',
      thoiGian: '5/2023',
      soTien: 530000,
    },
    {
      id: 4,
      stt: 4,
      tenChuHo: 'Hoàng Thị Tâm',
      tenDichVu: 'Internet',
      tenCanHo: '14',
      thoiGian: '10/2023',
      soTien: 260000,
    },
    {
      id: 5,
      stt: 5,
      tenChuHo: 'Nguyễn Văn Bảo',
      tenDichVu: 'Gửi xe',
      tenCanHo: '15',
      thoiGian: '11/2023',
      soTien: 60000,
    },
  ];

  // Filter records based on search query and filters
  const filteredRecords = useMemo(() => {
    return notificationRecords.filter((record) => {
      const matchesSearch = searchQuery
        ? record.tenChuHo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.tenDichVu.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesBuilding = selectedBuilding === 'all' ? true : true; // Add building filter logic
      const matchesService = selectedService ? record.tenDichVu === selectedService : true;

      return matchesSearch && matchesBuilding && matchesService;
    });
  }, [notificationRecords, searchQuery, selectedBuilding, selectedService]);

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
        Thông báo thu phí
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
            Gửi thông báo
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
              <MenuItem value="Điện">Điện</MenuItem>
              <MenuItem value="Nước">Nước</MenuItem>
              <MenuItem value="Internet">Internet</MenuItem>
              <MenuItem value="Bảo trì">Bảo trì</MenuItem>
              <MenuItem value="Gửi xe">Gửi xe</MenuItem>
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
                <TableCell padding="checkbox" sx={{ pl: 3 }}>
                  <input type="checkbox" />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Tên chủ hộ</TableCell>
                <TableCell>Tên dịch vụ</TableCell>
                <TableCell>Tên căn hộ</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Số tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>{record.stt}</TableCell>
                  <TableCell>{record.tenChuHo}</TableCell>
                  <TableCell>{record.tenDichVu}</TableCell>
                  <TableCell>{record.tenCanHo}</TableCell>
                  <TableCell>{record.thoiGian}</TableCell>
                  <TableCell>{formatCurrency(record.soTien)}</TableCell>
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

export default FeeNotification; 