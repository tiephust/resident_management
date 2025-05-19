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
import AddVehicleDialog from '../../components/admin/apartment/AddVehicleDialog';
import EditVehicleDialog from '../../components/admin/apartment/EditVehicleDialog';
import DeleteVehicleDialog from '../../components/admin/apartment/DeleteVehicleDialog';
import AddDeviceDialog from '../../components/admin/apartment/AddDeviceDialog';
import { ApartmentDetail, Vehicle, NewApartment } from '../../types/admin/ApartmentManagementType';
import { Device, NewDevice } from '../../types/admin/DeviceManagementType';
import { apartmentService } from '../../services/admin/apartmentService';
import { managementResidentService } from '../../services/admin/ManagementResidentService';
import { deviceService } from '../../services/admin/deviceService';

const ApartmentDetailsManagement = () => {
  const [apartments, setApartments] = useState<ApartmentDetail[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  const [editVehicleDialogOpen, setEditVehicleDialogOpen] = useState(false);
  const [deleteVehicleDialogOpen, setDeleteVehicleDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [addApartmentDialogOpen, setAddApartmentDialogOpen] = useState(false);
  const [newApartment, setNewApartment] = useState<NewApartment>({
    name: '',
    apartmentOwnerId: 0,
    description: '',
    building: 'S1',
    floor: 1,
    numResidents: 1,
    numKeys: 1,
    parkingSlots: { car: 0, bike: 0 },
  });
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'Xe máy',
    licensePlate: '',
    brand: '',
    model: '',
    color: '',
  });
  const [newDevice, setNewDevice] = useState<NewDevice>({
    name: '',
    type: '',
    status: 'ACTIVE',
    maintenanceAt: new Date().toISOString().split('T')[0],
    apartmentId: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apartmentsData = await apartmentService.getAllApartments();
        const apartmentsWithDetails = await Promise.all(
          apartmentsData.map(async (apt) => {
            const owner = apt.apartmentOwnerId
              ? await managementResidentService.getResidentById(apt.apartmentOwnerId)
              : { name: 'Không xác định' };
            const devices = apt.deviceIds.length
              ? await Promise.all(apt.deviceIds.map((id) => deviceService.getDeviceById(id)))
              : [];
            return {
              ...apt,
              building: 'S1' as const,
              floor: 1,
              ownerName: owner.name,
              vehicles: [],
              numResidents: apt.residentIds.length,
              numKeys: 0,
              parkingSlots: { car: 0, bike: 0 },
            };
          })
        );
        setApartments(apartmentsWithDetails);
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

  const handleOpenDetails = (apartment: ApartmentDetail) => {
    setSelectedApartment(apartment);
    setDevices(apartments.find((apt) => apt.id === apartment.id)?.deviceIds.map((id) => devices.find((d) => d.id === id)!).filter(Boolean) || []);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedApartment(null);
  };

  const handleOpenDelete = (apartment: ApartmentDetail) => {
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
        await apartmentService.deleteApartment(selectedApartment.id);
        setApartments(apartments.filter((apt) => apt.id !== selectedApartment.id));
        handleCloseDelete();
      } catch (err) {
        setError('Lỗi khi xóa căn hộ. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenAddVehicle = () => {
    setAddVehicleDialogOpen(true);
  };

  const handleCloseAddVehicle = () => {
    setAddVehicleDialogOpen(false);
    setNewVehicle({
      type: 'Xe máy',
      licensePlate: '',
      brand: '',
      model: '',
      color: '',
    });
  };

  const handleAddVehicle = () => {
    if (selectedApartment && newVehicle.type && newVehicle.licensePlate) {
      const updatedApartments = apartments.map((apt) => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: [
              ...(apt.vehicles || []),
              {
                id: Math.max(...(apt.vehicles?.map((v) => v.id) || [0]), 0) + 1,
                type: newVehicle.type as 'Ô tô' | 'Xe máy',
                licensePlate: newVehicle.licensePlate!,
                brand: newVehicle.brand || '',
                model: newVehicle.model || '',
                color: newVehicle.color || '',
              },
            ],
          };
        }
        return apt;
      });
      setApartments(updatedApartments);
      handleCloseAddVehicle();
    }
  };

  const handleOpenEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle({ ...vehicle });
    setEditVehicleDialogOpen(true);
  };

  const handleCloseEditVehicle = () => {
    setEditVehicleDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleUpdateVehicle = () => {
    if (selectedApartment && editingVehicle) {
      const updatedApartments = apartments.map((apt) => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: apt.vehicles?.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)) || [],
          };
        }
        return apt;
      });
      setApartments(updatedApartments);
      handleCloseEditVehicle();
    }
  };

  const handleOpenDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteVehicleDialogOpen(true);
  };

  const handleCloseDeleteVehicle = () => {
    setDeleteVehicleDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = () => {
    if (selectedApartment && selectedVehicle) {
      const updatedApartments = apartments.map((apt) => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: apt.vehicles?.filter((v) => v.id !== selectedVehicle.id) || [],
          };
        }
        return apt;
      });
      setApartments(updatedApartments);
      handleCloseDeleteVehicle();
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
      building: 'S1',
      floor: 1,
      numResidents: 1,
      numKeys: 1,
      parkingSlots: { car: 0, bike: 0 },
    });
  };

  const handleAddApartment = async () => {
    if (newApartment.name && newApartment.apartmentOwnerId) {
      try {
        const createdApartment = await apartmentService.createApartment(newApartment);
        const owner = newApartment.apartmentOwnerId
          ? await managementResidentService.getResidentById(newApartment.apartmentOwnerId)
          : { name: 'Không xác định' };
        setApartments([
          ...apartments,
          {
            ...createdApartment,
            building: newApartment.building as 'S1' | 'S2',
            floor: newApartment.floor,
            ownerName: owner.name,
            vehicles: [],
            numResidents: newApartment.numResidents,
            numKeys: newApartment.numKeys,
            parkingSlots: newApartment.parkingSlots,
          },
        ]);
        handleCloseAddApartment();
      } catch (err) {
        setError('Lỗi khi thêm căn hộ. Vui lòng thử lại.');
      }
    }
  };

  const handleOpenAddDevice = () => {
    if (selectedApartment) {
      setNewDevice({ ...newDevice, apartmentId: selectedApartment.id });
      setAddDeviceDialogOpen(true);
    }
  };

  const handleCloseAddDevice = () => {
    setAddDeviceDialogOpen(false);
    setNewDevice({
      name: '',
      type: '',
      status: 'ACTIVE',
      maintenanceAt: new Date().toISOString().split('T')[0],
      apartmentId: 0,
    });
  };

  const handleAddDevice = async () => {
    if (selectedApartment && newDevice.name && newDevice.type) {
      try {
        const createdDevice = await deviceService.createDevice(newDevice);
        setDevices([...devices, createdDevice]);
        setApartments(
          apartments.map((apt) =>
            apt.id === selectedApartment.id
              ? { ...apt, deviceIds: [...apt.deviceIds, createdDevice.id] }
              : apt
          )
        );
        handleCloseAddDevice();
      } catch (err) {
        setError('Lỗi khi thêm thiết bị. Vui lòng thử lại.');
      }
    }
  };

  const getVehicleSummary = (vehicles: Vehicle[] | undefined) => {
    if (!vehicles) return '0 xe';
    const cars = vehicles.filter((v) => v.type === 'Ô tô').length;
    const bikes = vehicles.filter((v) => v.type === 'Xe máy').length;
    return `${cars} ô tô, ${bikes} xe máy`;
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
              <TableCell>Số lượng xe</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apartments.map((apartment) => (
              <TableRow key={apartment.id}>
                <TableCell>
                  {apartment.building} - {apartment.name}
                </TableCell>
                <TableCell>{apartment.ownerName}</TableCell>
                <TableCell>{getVehicleSummary(apartment.vehicles)}</TableCell>
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
        devices={devices.filter((d) => selectedApartment?.deviceIds.includes(d.id))}
        onClose={handleCloseDetails}
        onSave={handleCloseDetails}
        onAddVehicle={handleOpenAddVehicle}
        onEditVehicle={handleOpenEditVehicle}
        onDeleteVehicle={handleOpenDeleteVehicle}
        onAddDevice={handleOpenAddDevice}
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

      <AddVehicleDialog
        open={addVehicleDialogOpen}
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        onClose={handleCloseAddVehicle}
        onAdd={handleAddVehicle}
      />

      <EditVehicleDialog
        open={editVehicleDialogOpen}
        vehicle={editingVehicle}
        setVehicle={setEditingVehicle}
        onClose={handleCloseEditVehicle}
        onSave={handleUpdateVehicle}
      />

      <DeleteVehicleDialog
        open={deleteVehicleDialogOpen}
        vehicle={selectedVehicle}
        onClose={handleCloseDeleteVehicle}
        onDelete={handleDeleteVehicle}
      />

      <AddDeviceDialog
        open={addDeviceDialogOpen}
        newDevice={newDevice}
        setNewDevice={setNewDevice}
        onClose={handleCloseAddDevice}
        onAdd={handleAddDevice}
      />
    </Box>
  );
};

export default ApartmentDetailsManagement;