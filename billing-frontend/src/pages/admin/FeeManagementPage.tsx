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
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FeeDialog from '../../components/admin/FeeDialog';
import { Fee, NewFee } from '../../types/admin/FeeManagementType';
import { managementFeeService } from '../../services/admin/ManagementFeeService';
import { managementFeeTypeService } from '../../services/admin/ManagementFeeTypeService';

interface FeeRecord {
  id: number;
  stt: number;
  tenChuHo: string;
  tenDichVu: string;
  loaiDichVu: string;
  hanDong: string;
  soTien: number;
  tinhTrang: 'Đã đóng' | 'Chưa đóng' | 'Quá hạn';
  building?: 's1' | 's2';
}

const FeeManagementPage = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedService, setSelectedService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | NewFee | null>(null);
  const [feeTypes, setFeeTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feesData, feeTypesData] = await Promise.all([
          managementFeeService.getAllFees(),
          managementFeeTypeService.getAllFeeTypes(),
        ]);
        console.log('Fees Data:', feesData);
        console.log('Fee Types Data:', feeTypesData);
        setFees(Array.isArray(feesData) ? feesData : []);
        setFeeTypes(Array.isArray(feeTypesData) ? feeTypesData : []);
        setError(null);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = (fee?: Fee) => {
    setSelectedFee(
        fee
            ? { ...fee }
            : {
              resident: { id: 0 },
              feeType: { id: 0 },
              amount: 0,
              dueDate: null,
              description: null,
            }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFee(null);
  };

  const handleSaveFee = async () => {
    if (!selectedFee) return;
    try {
      if ('id' in selectedFee) {
        await managementFeeService.updateFee(selectedFee.id, selectedFee);
      } else {
        await managementFeeService.createFee(selectedFee);
      }
      const feesData = await managementFeeService.getAllFees();
      setFees(Array.isArray(feesData) ? feesData : []);
      handleCloseDialog();
    } catch (error) {
      console.error('Lỗi khi lưu khoản phí:', error);
      setError('Lỗi khi lưu khoản phí. Vui lòng thử lại.');
    }
  };

  const handleDeleteFee = async (id: number) => {
    try {
      await managementFeeService.deleteFee(id);
      setFees(fees.filter((fee) => fee.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa khoản phí:', error);
      setError('Lỗi khi xóa khoản phí. Vui lòng thử lại.');
    }
  };

  const mapStatusToTinhTrang = (status: Fee['status']): FeeRecord['tinhTrang'] => {
    switch (status) {
      case 'PAID':
        return 'Đã đóng';
      case 'UNPAID':
        return 'Chưa đóng';
      case 'OVERDUE':
        return 'Quá hạn';
      default:
        return 'Chưa đóng';
    }
  };

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const record = {
        tenChuHo: fee.resident?.name || 'Không xác định',
        tenDichVu: fee.feeType?.name || 'Không xác định',
        hanDong: fee.dueDate
            ? new Date(fee.dueDate).toLocaleDateString('vi-VN')
            : 'Không xác định',
      };

      const matchesSearch = searchQuery
          ? record.tenChuHo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.tenDichVu.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
      const matchesBuilding = selectedBuilding === 'all' ? true : fee.resident?.building === selectedBuilding;
      const matchesService = selectedService
          ? fee.feeType?.name === selectedService
          : true;
      const matchesMonth = selectedMonth
          ? record.hanDong !== 'Không xác định' &&
          new Date(fee.dueDate).getMonth() + 1 === parseInt(selectedMonth)
          : true;
      const matchesYear = selectedYear
          ? record.hanDong !== 'Không xác định' &&
          new Date(fee.dueDate).getFullYear() === parseInt(selectedYear)
          : true;

      return (
          matchesSearch &&
          matchesBuilding &&
          matchesService &&
          matchesMonth &&
          matchesYear
      );
    });
  }, [fees, searchQuery, selectedBuilding, selectedService, selectedMonth, selectedYear]);

  const feeRecords: FeeRecord[] = useMemo(() => {
    console.log('Raw Fees:', filteredFees);
    const records = filteredFees
        .filter((fee) => !!fee.resident && !!fee.feeType && !!fee.dueDate)
        .map((fee, index) => ({
          id: fee.id,
          stt: index + 1,
          tenChuHo: fee.resident?.name || 'Không xác định',
          tenDichVu: fee.feeType?.name || 'Không xác định',
          loaiDichVu: fee.feeType?.category || 'Không xác định',
          hanDong: fee.dueDate
              ? new Date(fee.dueDate).toLocaleDateString('vi-VN')
              : 'Không xác định',
          soTien: fee.amount || 0,
          tinhTrang: mapStatusToTinhTrang(fee.status),
          building: fee.resident?.building,
        }));
    console.log('Fee Records:', records);
    return records;
  }, [filteredFees]);

  const totalPages = Math.ceil(feeRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = feeRecords.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
        >
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
    );
  }

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
              <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="Cả 2 chung cư"
              />
              <FormControlLabel value="s1" control={<Radio />} label="S1" />
              <FormControlLabel value="s2" control={<Radio />} label="S2" />
            </RadioGroup>
            <Box sx={{ flexGrow: 1 }} />
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ height: 40 }}
                onClick={() => handleOpenDialog()}
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
                <MenuItem value="">Tất cả</MenuItem>
                {feeTypes.map((feeType) => (
                    <MenuItem key={feeType.id} value={feeType.name}>
                      {feeType.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Chọn tháng</InputLabel>
              <Select
                  value={selectedMonth}
                  label="Chọn tháng"
                  onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <MenuItem key={month} value={month}>
                      Tháng {month}
                    </MenuItem>
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
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <TextField
                placeholder="Tên chủ hộ, tên dịch vụ"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
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
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Không có khoản phí nào để hiển thị
                      </TableCell>
                    </TableRow>
                ) : (
                    paginatedRecords.map((record) => (
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
                                color={
                                  record.tinhTrang === 'Đã đóng'
                                      ? 'info'
                                      : record.tinhTrang === 'Chưa đóng'
                                          ? 'warning'
                                          : 'error'
                                }
                                sx={{
                                  bgcolor:
                                      record.tinhTrang === 'Đã đóng'
                                          ? '#E8F5E9'
                                          : record.tinhTrang === 'Chưa đóng'
                                              ? '#FFF3E0'
                                              : '#FFEBEE',
                                  color:
                                      record.tinhTrang === 'Đã đóng'
                                          ? '#2E7D32'
                                          : record.tinhTrang === 'Chưa đóng'
                                              ? '#EF6C00'
                                              : '#C62828',
                                  fontWeight: 500,
                                }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                                onClick={() =>
                                    handleOpenDialog(fees.find((f) => f.id === record.id))
                                }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteFee(record.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))
                )}
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
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
            >
              →
            </Button>
          </Box>
        </Box>

        <FeeDialog
            open={openDialog}
            fee={selectedFee}
            setFee={setSelectedFee}
            onClose={handleCloseDialog}
            onSave={handleSaveFee}
        />
      </Box>
  );
};

export default FeeManagementPage;