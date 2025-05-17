import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { managementResidentService } from '../../services/admin/ManagementResidentService';
import { Resident, NewResident } from '../../types/admin/ResidentManagementType';
import AddResidentDialog from '../../components/admin/AddResidentDialog';
import TempResidenceDialog from '../../components/admin/TempResidenceDialog';
import TempLeaveDialog from '../../components/admin/TempLeaveDialog';
import EditResidentDialog from '../../components/admin/EditResidentDialog';
import DeleteConfirmationDialog from '../../components/admin/DeleteConfirmationDialog';

type Order = 'asc' | 'desc';

const roleConfig: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
  RESIDENT: { label: 'Cư dân', color: 'success' },
  TEMPORARY: { label: 'Tạm trú', color: 'warning' },
  GUEST: { label: 'Khách', color: 'info' },
};

const ResidentManagementPage: React.FC = () => {
  // Data state
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sort and filter states
  const [orderBy, setOrderBy] = useState<keyof Resident>('name');
  const [order, setOrder] = useState<Order>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Dialog states
  const [addResidentDialog, setAddResidentDialog] = useState(false);
  const [tempResidenceDialog, setTempResidenceDialog] = useState(false);
  const [tempLeaveDialog, setTempLeaveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | NewResident | null>(null);

  // Load residents
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const data = await managementResidentService.getAllResidents();
        const mappedData = data.map((item: any) => ({
          ...item,
          password: item.password || '',
          isActive: item.isActive ?? true,
          gender: item.gender || '',
          hometown: item.hometown || '',
          address: item.address || '',
          description: item.description || '',
          birthday: item.birthday || '',
          stripeCustomerId: item.stripeCustomerId || '',
        }));
        setResidents(mappedData);
      } catch (error) {
        setError('Lỗi khi tải danh sách cư dân');
        console.error('Lỗi khi tải danh sách cư dân:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResidents();
  }, []);

  // Handle sorting
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
    const aValue = a[orderBy] ?? '';
    const bValue = b[orderBy] ?? '';
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  // Handle search
  const handleSearch = async () => {
    try {
      const data = await managementResidentService.searchResidents(searchTerm);
      const mappedData = data.map((item: any) => ({
        ...item,
        password: item.password || '',
        isActive: item.isActive ?? true,
        gender: item.gender || '',
        hometown: item.hometown || '',
        address: item.address || '',
        description: item.description || '',
        birthday: item.birthday || '',
        stripeCustomerId: item.stripeCustomerId || '',
      }));
      setResidents(mappedData);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm cư dân:', error);
    }
  };

  // Handle role filter
  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
  };

  // Filter and sort residents
  const filteredResidents = residents
      .filter((resident) => {
        const matchesSearch = Object.values(resident)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? resident.role === roleFilter : true;
        return matchesSearch && matchesRole;
      })
      .sort(getComparator(order, orderBy));

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setSelectedResident({
      name: '',
      email: '',
      phoneNumber: '',
      unitNumber: '',
      department: '',
      leaseStartDate: '',
      leaseEndDate: '',
      role: 'RESIDENT',
      password: '1',
      gender: '',
      hometown: '',
      address: '',
      description: '',
      birthday: '',
      stripeCustomerId: '',
      isActive: true,
    });
    setAddResidentDialog(true);
  };

  const handleOpenTempResidenceDialog = () => {
    setSelectedResident({
      name: '',
      email: '',
      phoneNumber: '',
      unitNumber: '',
      department: '',
      leaseStartDate: '',
      leaseEndDate: '',
      role: 'TEMPORARY',
      password: '1',
      gender: '',
      hometown: '',
      address: '',
      description: '',
      birthday: '',
      stripeCustomerId: '',
      isActive: true,
    });
    setTempResidenceDialog(true);
  };

  const handleOpenEditDialog = (resident: Resident) => {
    setSelectedResident(resident);
    setEditDialog(true);
  };

  const handleOpenDeleteDialog = (resident: Resident) => {
    setSelectedResident(resident);
    setDeleteDialog(true);
  };

  const handleOpenTempLeaveDialog = (resident: Resident) => {
    setSelectedResident(resident);
    setTempLeaveDialog(true);
  };

  const handleCloseDialog = () => {
    setAddResidentDialog(false);
    setTempResidenceDialog(false);
    setTempLeaveDialog(false);
    setEditDialog(false);
    setDeleteDialog(false);
    setSelectedResident(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setSelectedResident(null);
  };

  // Data operations
  const handleSaveResident = async () => {
    try {
      if (selectedResident) {
        const { password, gender, hometown, address, description, birthday, stripeCustomerId, isActive, ...residentData } = selectedResident;
        if ('id' in selectedResident && selectedResident.id) {
          await managementResidentService.updateResident(selectedResident.id, residentData as NewResident);
        } else {
          await managementResidentService.createResident(residentData as NewResident);
        }
        const data = await managementResidentService.getAllResidents();
        const mappedData = data.map((item: any) => ({
          ...item,
          password: item.password || '',
          isActive: item.isActive ?? true,
          gender: item.gender || '',
          hometown: item.hometown || '',
          address: item.address || '',
          description: item.description || '',
          birthday: item.birthday || '',
          stripeCustomerId: item.stripeCustomerId || '',
        }));
        setResidents(mappedData);
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Lỗi khi lưu cư dân:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedResident && 'id' in selectedResident) {
        await managementResidentService.deleteResident(selectedResident.id);
        const data = await managementResidentService.getAllResidents();
        const mappedData = data.map((item: any) => ({
          ...item,
          password: item.password || '',
          isActive: item.isActive ?? true,
          gender: item.gender || '',
          hometown: item.hometown || '',
          address: item.address || '',
          description: item.description || '',
          birthday: item.birthday || '',
          stripeCustomerId: item.stripeCustomerId || '',
        }));
        setResidents(mappedData);
        handleCloseDeleteDialog();
      }
    } catch (error) {
      console.error('Lỗi khi xóa cư dân:', error);
    }
  };

  if (loading) return <PageTemplate title="Quản Lý Cư Dân">Đang tải...</PageTemplate>;
  if (error) return <PageTemplate title="Quản Lý Cư Dân">{error}</PageTemplate>;

  return (
      <PageTemplate title="Quản Lý Cư Dân">
        <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
              Thêm cư dân
            </Button>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenTempResidenceDialog}>
              Khai báo tạm trú
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                placeholder="Tìm kiếm..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ width: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Vai trò</InputLabel>
              <Select value={roleFilter} label="Vai trò" onChange={(e) => handleRoleFilterChange(e.target.value)}>
                <MenuItem value="">Tất cả</MenuItem>
                {Object.keys(roleConfig).map((role) => (
                    <MenuItem key={role} value={role}>{roleConfig[role].label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
                    CCCD
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
                      active={orderBy === 'department'}
                      direction={orderBy === 'department' ? order : 'asc'}
                      onClick={() => handleRequestSort('department')}
                  >
                    Phòng ban
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                      active={orderBy === 'address'}
                      direction={orderBy === 'address' ? order : 'asc'}
                      onClick={() => handleRequestSort('address')}
                  >
                    Địa chỉ
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleRequestSort('role')}
                  >
                    Vai trò
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResidents.map((resident) => (
                  <TableRow key={`${resident.email}-${resident.name}`}>
                    <TableCell>{resident.name}</TableCell>
                    <TableCell>{resident.email}</TableCell>
                    <TableCell>{resident.unitNumber}</TableCell>
                    <TableCell>{resident.phoneNumber}</TableCell>
                    <TableCell>{resident.department}</TableCell>
                    <TableCell>{resident.address}</TableCell>
                    <TableCell>
                      <Chip
                          label={roleConfig[resident.role]?.label || resident.role}
                          color={roleConfig[resident.role]?.color || 'default'}
                          size="small"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(resident)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(resident)}>
                        <EditIcon />
                      </IconButton>
                      <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenTempLeaveDialog(resident)}
                      >
                        Thêm tạm vắng
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AddResidentDialog
            open={addResidentDialog}
            resident={selectedResident}
            setResident={setSelectedResident}
            onClose={handleCloseDialog}
            onSave={handleSaveResident}
        />
        <TempResidenceDialog
            open={tempResidenceDialog}
            resident={selectedResident}
            setResident={setSelectedResident}
            onClose={handleCloseDialog}
            onSave={handleSaveResident}
        />
        <TempLeaveDialog
            open={tempLeaveDialog}
            resident={selectedResident as Resident | null}
            onClose={handleCloseDialog}
        />
        <EditResidentDialog
            open={editDialog}
            resident={selectedResident as Resident | null}
            setResident={setSelectedResident}
            onClose={handleCloseDialog}
            onSave={handleSaveResident}
        />
        <DeleteConfirmationDialog
            open={deleteDialog}
            title="Xác nhận xóa cư dân"
            content={`Bạn có chắc chắn muốn xóa cư dân ${selectedResident && 'name' in selectedResident ? selectedResident.name : ''} không?`}
            onClose={handleCloseDeleteDialog}
            onDelete={handleDelete}
        />
      </PageTemplate>
  );
};

export default ResidentManagementPage;