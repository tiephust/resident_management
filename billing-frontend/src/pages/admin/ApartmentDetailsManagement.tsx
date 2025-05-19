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
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ApartmentDetailsDialog from '../../components/admin/ApartmentDetailsDialog';
import AddApartmentDialog from '../../components/admin/apartment/AddApartmentDialog';
import DeleteApartmentDialog from '../../components/admin/apartment/DeleteApartmentDialog';
import DeviceDialog from '../../components/admin/DeviceDialog';
import { ApartmentDTO, NewApartmentDTO } from '../../types/admin/ApartmentServiceType';
import { Device, NewDevice, Apartment } from '../../types/admin/DeviceManagementType';
import { managementApartmentService } from '../../services/admin/ManageApartmentService';
import { deviceService } from '../../services/admin/deviceService';

const ApartmentDetailsManagement = () => {
  const [apartments, setApartments] = useState<ApartmentDTO[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentDTO | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | NewDevice | null>(null);
  const [addApartmentDialogOpen, setAddApartmentDialogOpen] = useState(false);
  const [newApartment, setNewApartment] = useState<NewApartmentDTO>({
    name: '',
    apartmentOwnerId: 0,
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apartmentsData = await managementApartmentService.getAllApartments();
        setApartments(apartmentsData);
        const allDevices = apartmentsData.flatMap((apt) => apt.deviceIds);
        const uniqueDevices = await Promise.all(
          Array.from(new Set(allDevices)).map((id) => deviceService.getDeviceById(id))
        );
        setDevices(uniqueDevices);
        setError(null);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDetails = (apartment: ApartmentDTO) => {
    setSelectedApartment(apartment);
    setDevices(apartments.find((apt) => apt.id === apartment.id)?.deviceIds.map((id) => devices.find((d) => d.id === id)!).filter(Boolean) || []);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedApartment(null);
  };

  const handleOpenDelete = (apartment: ApartmentDTO) => {
    setSelectedApartment(apartment);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedApartment(null);
  };

  const handleDelete = async () => {
    if (selectedApartment) {
      try {
        await managementApartmentService.deleteApartment(selectedApartment.id);
        setApartments(apartments.filter((apt) => apt.id !== selectedApartment.id));
        handleCloseDelete();
      } catch (err) {
        setError('Lỗi khi xóa căn hộ. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenAddApartment = () => {
    setAddApartmentDialogOpen(true);
  };

  const handleCloseAddApartment = () => {
    setAddApartmentDialogOpen(false);
    setNewApartment({
      name: '',
      apartmentOwnerId: 0,
      description: '',
    });
  };

  const handleAddApartment = async () => {
    if (newApartment.name && newApartment.apartmentOwnerId) {
      try {
        const createdApartment = await managementApartmentService.createApartment(newApartment);
        setApartments([...apartments, createdApartment]);
        handleCloseAddApartment();
      } catch (err) {
        setError('Lỗi khi thêm căn hộ. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenDeviceDialog = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
    } else {
      setEditingDevice({
        name: '',
        type: '',
        status: 'ACTIVE',
        maintenanceAt: new Date().toISOString().split('T')[0],
        description: '',
        numberCard: '',
        apartmentId: selectedApartment?.id || 0,
      });
    }
    setDeviceDialogOpen(true);
  };

  const handleCloseDeviceDialog = () => {
    setDeviceDialogOpen(false);
    setEditingDevice(null);
  };

  const handleSaveDevice = async () => {
    try {
      if (editingDevice && 'id' in editingDevice) {
        await deviceService.updateDevice(editingDevice.id, editingDevice as NewDevice);
      } else if (editingDevice) {
        await deviceService.createDevice(editingDevice as NewDevice);
      }
      handleCloseDeviceDialog();
      if (selectedApartment) {
        const updatedDevices = await Promise.all(
          selectedApartment.deviceIds.map((id) => deviceService.getDeviceById(id))
        );
        setDevices(updatedDevices);
      }
    } catch (err) {
      setError('Lỗi khi lưu thiết bị. Vui lòng thử lại.');
    }
  };

  const handleDeleteDevice = async (device: Device) => {
    try {
      await deviceService.deleteDevice(device.id);
      if (selectedApartment) {
        const updatedDevices = await Promise.all(
          selectedApartment.deviceIds
            .filter((id) => id !== device.id)
            .map((id) => deviceService.getDeviceById(id))
        );
        setDevices(updatedDevices);
      }
    } catch (err) {
      setError('Lỗi khi xóa thiết bị. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý thông tin căn hộ
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddApartment}>
          Thêm căn hộ
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Căn hộ</TableCell>
              <TableCell>Chủ căn hộ</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apartments.map((apartment) => (
              <TableRow key={apartment.id}>
                <TableCell>{apartment.name}</TableCell>
                <TableCell>{apartment.apartmentOwnerId}</TableCell>
                <TableCell>{apartment.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDetails(apartment)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(apartment)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ApartmentDetailsDialog
        open={detailsOpen}
        apartment={selectedApartment}
        devices={devices}
        onClose={handleCloseDetails}
        onSave={handleCloseDetails}
        onAddDevice={() => handleOpenDeviceDialog()}
        onEditDevice={(device) => handleOpenDeviceDialog(device)}
        onDeleteDevice={handleDeleteDevice}
      />

      <AddApartmentDialog
        open={addApartmentDialogOpen}
        newApartment={newApartment}
        setNewApartment={setNewApartment}
        onClose={handleCloseAddApartment}
        onAdd={handleAddApartment}
      />

      <DeleteApartmentDialog
        open={deleteDialogOpen}
        apartment={selectedApartment}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
      />

      <DeviceDialog
        open={deviceDialogOpen}
        device={editingDevice}
        setDevice={setEditingDevice}
        onClose={handleCloseDeviceDialog}
        onSave={handleSaveDevice}
        apartments={apartments.map(apt => ({
          id: apt.id,
          name: apt.name,
          description: apt.description || '',
          apartmentOwnerId: apt.apartmentOwnerId,
          feeIds: apt.feeIds,
          residentIds: apt.residentIds,
          deviceIds: apt.deviceIds,
          createdAt: apt.createdAt || '', // Xử lý null case
          updatedAt: apt.updatedAt || ''  // Xử lý null case
        }))}
      />
    </Box>
  );
};

export default ApartmentDetailsManagement;