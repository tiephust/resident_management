import React, { useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';

type Order = 'asc' | 'desc';

interface Resident {
  id: number;
  name: string;
  email: string;
  unitNumber: string;
  phoneNumber: string;
  status: 'resident' | 'temporary';
}

const Residents: React.FC = () => {
  // Sort states
  const [orderBy, setOrderBy] = useState<keyof Resident>('name');
  const [order, setOrder] = useState<Order>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      unitNumber: '101',
      phoneNumber: '123-456-7890',
      status: 'resident',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      unitNumber: '102',
      phoneNumber: '987-654-3210',
      status: 'temporary',
    },
  ]);

  // Dialog states
  const [addResidentDialog, setAddResidentDialog] = useState(false);
  const [tempResidenceDialog, setTempResidenceDialog] = useState(false);
  const [tempLeaveDialog, setTempLeaveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const handleRequestSort = (property: keyof Resident) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getComparator = (order: Order, orderBy: keyof Resident) => {
    return order === 'desc'
      ? (a: Resident, b: Resident) => descendingComparator(a, b, orderBy)
      : (a: Resident, b: Resident) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a: Resident, b: Resident, orderBy: keyof Resident) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const filteredResidents = residents
    .filter((resident) =>
      Object.values(resident)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort(getComparator(order, orderBy));

  const handleDelete = (resident: Resident) => {
    setSelectedResident(resident);
    setDeleteDialog(true);
  };

  const handleEdit = (resident: Resident) => {
    setSelectedResident(resident);
    setEditDialog(true);
  };

  const handleTempLeave = (resident: Resident) => {
    setSelectedResident(resident);
    setTempLeaveDialog(true);
  };

  return (
    <PageTemplate title="Quản Lý Cư Dân">
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddResidentDialog(true)}
          >
            Thêm cư dân
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setTempResidenceDialog(true)}
          >
            Khai báo tạm trú
          </Button>
        </Box>
        <TextField
          placeholder="Tìm kiếm..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Họ và tên
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'unitNumber'}
                  direction={orderBy === 'unitNumber' ? order : 'asc'}
                  onClick={() => handleRequestSort('unitNumber')}
                >
                  Số căn hộ
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'phoneNumber'}
                  direction={orderBy === 'phoneNumber' ? order : 'asc'}
                  onClick={() => handleRequestSort('phoneNumber')}
                >
                  Số điện thoại
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.unitNumber}</TableCell>
                <TableCell>{resident.phoneNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={resident.status === 'resident' ? 'Cư dân' : 'Tạm trú'}
                    color={resident.status === 'resident' ? 'success' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(resident)}
                  >
                    Xóa
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(resident)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleTempLeave(resident)}
                  >
                    Thêm tạm vắng
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Resident Dialog */}
      <Dialog open={addResidentDialog} onClose={() => setAddResidentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm cư dân mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Họ và tên" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Số căn hộ" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Số điện thoại" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddResidentDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setAddResidentDialog(false)}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Temporary Residence Declaration Dialog */}
      <Dialog open={tempResidenceDialog} onClose={() => setTempResidenceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
          Chi tiết thông tin tạm trú
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CCCD"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value=""
                  label="Giới tính"
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Địa chỉ đăng ký tạm trú"
                multiline
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Chung cư</InputLabel>
                <Select
                  value="S1"
                  label="Chung cư"
                >
                  <MenuItem value="S1">S1</MenuItem>
                  <MenuItem value="S2">S2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lý do"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTempResidenceDialog(false)} variant="outlined">
            Hủy
          </Button>
          <Button variant="contained" onClick={() => setTempResidenceDialog(false)}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Temporary Leave Dialog */}
      <Dialog open={tempLeaveDialog} onClose={() => setTempLeaveDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
          Chi tiết thông tin tạm vắng
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                required
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="text"
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CCCD"
                required
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value=""
                  label="Giới tính"
                  disabled
                  sx={{ bgcolor: '#f5f5f5' }}
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
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Địa chỉ nơi đến"
                multiline
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: '#f5f5f5' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Chung cư</InputLabel>
                <Select
                  value="S1"
                  label="Chung cư"
                  disabled
                  sx={{ bgcolor: '#f5f5f5' }}
                >
                  <MenuItem value="S1">S1</MenuItem>
                  <MenuItem value="S2">S2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lý do"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTempLeaveDialog(false)} variant="outlined">
            Hủy
          </Button>
          <Button variant="contained" onClick={() => setTempLeaveDialog(false)}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Resident Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa thông tin cư dân</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                defaultValue={selectedResident?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedResident?.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số căn hộ"
                defaultValue={selectedResident?.unitNumber}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                defaultValue={selectedResident?.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={selectedResident?.status || 'resident'}
                  label="Trạng thái"
                >
                  <MenuItem value="resident">Đang cư trú</MenuItem>
                  <MenuItem value="temporary">Tạm trú</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setEditDialog(false)}>Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa cư dân {selectedResident?.name} không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={() => setDeleteDialog(false)}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </PageTemplate>
  );
};

export default Residents; 