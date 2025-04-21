import React, { useState, useEffect } from 'react';
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
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { residentService, Resident } from '../../services/residentService';

type NewResident = Omit<Resident, 'id'>;

const ResidentManagement: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | NewResident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const data = await residentService.getAllResidents();
      setResidents(data);
    } catch (error) {
      console.error('Error loading residents:', error);
    }
  };

  const handleOpenDialog = (resident?: Resident) => {
    if (resident) {
      setSelectedResident(resident);
    } else {
      setSelectedResident({
        name: '',
        email: '',
        phoneNumber: '',
        unitNumber: '',
        department: '',
        leaseStartDate: '',
        leaseEndDate: '',
        status: 'ACTIVE'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResident(null);
  };

  const handleSave = async () => {
    try {
      if (selectedResident && 'id' in selectedResident) {
        await residentService.updateResident(selectedResident.id, selectedResident);
      } else if (selectedResident) {
        await residentService.createResident(selectedResident);
      }
      handleCloseDialog();
      loadResidents();
    } catch (error) {
      console.error('Error saving resident:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await residentService.deleteResident(id);
      loadResidents();
    } catch (error) {
      console.error('Error deleting resident:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await residentService.searchResidents(searchTerm);
      setResidents(data);
    } catch (error) {
      console.error('Error searching residents:', error);
    }
  };

  const handleStatusFilter = async (status: string) => {
    try {
      const data = await residentService.getResidentsByStatus(status);
      setResidents(data);
    } catch (error) {
      console.error('Error filtering by status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý cư dân
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleStatusFilter(e.target.value);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
              <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            fullWidth
          >
            Thêm cư dân
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Số căn hộ</TableCell>
              <TableCell>Phòng ban</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.phoneNumber}</TableCell>
                <TableCell>{resident.unitNumber}</TableCell>
                <TableCell>{resident.department}</TableCell>
                <TableCell>{resident.leaseStartDate}</TableCell>
                <TableCell>{resident.leaseEndDate}</TableCell>
                <TableCell>{resident.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(resident)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(resident.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedResident && 'id' in selectedResident ? 'Chỉnh sửa cư dân' : 'Thêm cư dân mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                value={selectedResident?.name || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={selectedResident?.email || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={selectedResident?.phoneNumber || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số căn hộ"
                value={selectedResident?.unitNumber || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, unitNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phòng ban"
                value={selectedResident?.department || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                value={selectedResident?.leaseStartDate || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, leaseStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                type="date"
                value={selectedResident?.leaseEndDate || ''}
                onChange={(e) => setSelectedResident({ ...selectedResident!, leaseEndDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={selectedResident?.status || 'ACTIVE'}
                  label="Trạng thái"
                  onChange={(e) => setSelectedResident({ ...selectedResident!, status: e.target.value })}
                >
                  <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
                  <MenuItem value="INACTIVE">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResidentManagement; 