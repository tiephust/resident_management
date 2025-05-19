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
  Chip,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  TwoWheeler as BikeIcon,
  Key as KeyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Vehicle {
  id: number;
  type: 'Ô tô' | 'Xe máy';
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
}

interface ParkingSlots {
  car: number;
  bike: number;
}

interface ApartmentDetail {
  id: number;
  apartmentNumber: string;
  building: 'S1' | 'S2';
  floor: number;
  ownerName: string;
  vehicles: Vehicle[];
  numResidents: number;
  numKeys: number;
  parkingSlots: ParkingSlots;
  notes: string;
}

const ApartmentDetailsManagement = () => {
  const [apartments, setApartments] = useState<ApartmentDetail[]>([
    {
      id: 1,
      apartmentNumber: '101',
      building: 'S1',
      floor: 1,
      ownerName: 'Nguyễn Văn A',
      vehicles: [
        {
          id: 1,
          type: 'Ô tô',
          licensePlate: '29A-12345',
          brand: 'Toyota',
          model: 'Camry',
          color: 'Đen',
        },
        {
          id: 2,
          type: 'Xe máy',
          licensePlate: '29M1-23456',
          brand: 'Honda',
          model: 'Vision',
          color: 'Trắng',
        },
      ],
      numResidents: 4,
      numKeys: 3,
      parkingSlots: {
        car: 1,
        bike: 2,
      },
      notes: 'Căn góc, view đẹp',
    },
    {
      id: 2,
      apartmentNumber: '203',
      building: 'S2',
      floor: 2,
      ownerName: 'Trần Thị B',
      vehicles: [
        {
          id: 3,
          type: 'Xe máy',
          licensePlate: '29M1-34567',
          brand: 'Honda',
          model: 'Air Blade',
          color: 'Đỏ',
        },
      ],
      numResidents: 2,
      numKeys: 2,
      parkingSlots: {
        car: 0,
        bike: 1,
      },
      notes: '',
    },
  ]);

  const [selectedApartment, setSelectedApartment] = useState<ApartmentDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  const [deleteVehicleDialogOpen, setDeleteVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [addApartmentDialogOpen, setAddApartmentDialogOpen] = useState(false);
  const [newApartment, setNewApartment] = useState<Partial<Omit<ApartmentDetail, 'id' | 'vehicles'>> & { parkingSlots: ParkingSlots }>({
    building: 'S1',
    apartmentNumber: '',
    floor: 1,
    ownerName: '',
    numResidents: 1,
    numKeys: 1,
    parkingSlots: {
      car: 0,
      bike: 0,
    },
    notes: '',
  });
  const [tabValue, setTabValue] = useState(0);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'Xe máy',
    licensePlate: '',
    brand: '',
    model: '',
    color: '',
  });
  const [editVehicleDialogOpen, setEditVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleOpenDetails = (apartment: ApartmentDetail) => {
    setSelectedApartment(apartment);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedApartment(null);
    setTabValue(0);
  };

  const handleOpenDelete = (apartment: ApartmentDetail) => {
    setSelectedApartment(apartment);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedApartment(null);
  };

  const handleDelete = () => {
    if (selectedApartment) {
      setApartments(apartments.filter(apt => apt.id !== selectedApartment.id));
      handleCloseDelete();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
      const updatedApartments = apartments.map(apt => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: [
              ...apt.vehicles,
              {
                id: Math.max(...apt.vehicles.map(v => v.id)) + 1,
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

  const getVehicleSummary = (vehicles: Vehicle[]) => {
    const cars = vehicles.filter(v => v.type === 'Ô tô').length;
    const bikes = vehicles.filter(v => v.type === 'Xe máy').length;
    return `${cars} ô tô, ${bikes} xe máy`;
  };

  // Thêm căn hộ mới
  const handleOpenAddApartment = () => {
    setAddApartmentDialogOpen(true);
  };

  const handleCloseAddApartment = () => {
    setAddApartmentDialogOpen(false);
    setNewApartment({
      building: 'S1',
      apartmentNumber: '',
      floor: 1,
      ownerName: '',
      numResidents: 1,
      numKeys: 1,
      parkingSlots: {
        car: 0,
        bike: 0,
      },
      notes: '',
    });
  };

  const handleAddApartment = () => {
    if (newApartment.building && newApartment.apartmentNumber) {
      const newId = Math.max(...apartments.map(a => a.id)) + 1;
      setApartments([
        ...apartments,
        {
          id: newId,
          building: newApartment.building as 'S1' | 'S2',
          apartmentNumber: newApartment.apartmentNumber,
          floor: newApartment.floor || 1,
          ownerName: newApartment.ownerName || '',
          numResidents: newApartment.numResidents || 1,
          numKeys: newApartment.numKeys || 1,
          parkingSlots: newApartment.parkingSlots || { car: 0, bike: 0 },
          vehicles: [],
          notes: newApartment.notes || '',
        },
      ]);
      handleCloseAddApartment();
    }
  };

  // Xóa phương tiện
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
      const updatedApartments = apartments.map(apt => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: apt.vehicles.filter(v => v.id !== selectedVehicle.id),
          };
        }
        return apt;
      });
      setApartments(updatedApartments);
      handleCloseDeleteVehicle();
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
      const updatedApartments = apartments.map(apt => {
        if (apt.id === selectedApartment.id) {
          return {
            ...apt,
            vehicles: apt.vehicles.map(v => 
              v.id === editingVehicle.id ? editingVehicle : v
            ),
          };
        }
        return apt;
      });
      setApartments(updatedApartments);
      handleCloseEditVehicle();
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Quản lý thông tin căn hộ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddApartment}
        >
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
                <TableCell>{apartment.building} - {apartment.apartmentNumber}</TableCell>
                <TableCell>{apartment.ownerName}</TableCell>
                <TableCell>{getVehicleSummary(apartment.vehicles)}</TableCell>
                <TableCell>{apartment.notes}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenDetails(apartment)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleOpenDelete(apartment)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chi tiết căn hộ */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết căn hộ {selectedApartment?.building} - {selectedApartment?.apartmentNumber}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tab label="Thông tin cơ bản" />
            <Tab label="Phương tiện" />
            <Tab label="Ghi chú" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  label="Số căn hộ"
                  fullWidth
                  value={selectedApartment?.apartmentNumber}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tòa nhà"
                  fullWidth
                  value={selectedApartment?.building}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Tầng"
                  fullWidth
                  value={selectedApartment?.floor}
                  disabled
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Chủ căn hộ"
                  fullWidth
                  defaultValue={selectedApartment?.ownerName}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Số người ở"
                  fullWidth
                  type="number"
                  defaultValue={selectedApartment?.numResidents}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Số chìa khóa"
                  fullWidth
                  type="number"
                  defaultValue={selectedApartment?.numKeys}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Số chỗ để xe máy"
                  fullWidth
                  type="number"
                  defaultValue={selectedApartment?.parkingSlots.bike}
                />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Danh sách phương tiện
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  variant="outlined" 
                  size="small"
                  onClick={handleOpenAddVehicle}
                >
                  Thêm phương tiện
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại</TableCell>
                      <TableCell>Biển số</TableCell>
                      <TableCell>Hãng xe</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedApartment?.vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>{vehicle.licensePlate}</TableCell>
                        <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                        <TableCell>{vehicle.color}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenEditVehicle(vehicle)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenDeleteVehicle(vehicle)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tabValue === 2 && (
            <TextField
              label="Ghi chú"
              fullWidth
              multiline
              rows={4}
              defaultValue={selectedApartment?.notes}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Đóng</Button>
          <Button variant="contained" onClick={handleCloseDetails}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn xóa thông tin căn hộ {selectedApartment?.building} - {selectedApartment?.apartmentNumber}?
            Hành động này không thể hoàn tác.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm phương tiện */}
      <Dialog open={addVehicleDialogOpen} onClose={handleCloseAddVehicle}>
        <DialogTitle>Thêm phương tiện mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại phương tiện</InputLabel>
                <Select
                  value={newVehicle.type}
                  label="Loại phương tiện"
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as 'Ô tô' | 'Xe máy' })}
                >
                  <MenuItem value="Ô tô">Ô tô</MenuItem>
                  <MenuItem value="Xe máy">Xe máy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Biển số xe"
                fullWidth
                value={newVehicle.licensePlate}
                onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Hãng xe"
                fullWidth
                value={newVehicle.brand}
                onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Model"
                fullWidth
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Màu sắc"
                fullWidth
                value={newVehicle.color}
                onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVehicle}>Hủy</Button>
          <Button variant="contained" onClick={handleAddVehicle}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm căn hộ mới */}
      <Dialog open={addApartmentDialogOpen} onClose={handleCloseAddApartment} maxWidth="md" fullWidth>
        <DialogTitle>Thêm căn hộ mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Số căn hộ"
                fullWidth
                required
                value={newApartment.apartmentNumber}
                onChange={(e) => setNewApartment({ ...newApartment, apartmentNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Tòa nhà</InputLabel>
                <Select
                  value={newApartment.building}
                  label="Tòa nhà"
                  onChange={(e) => setNewApartment({ ...newApartment, building: e.target.value as 'S1' | 'S2' })}
                >
                  <MenuItem value="S1">S1</MenuItem>
                  <MenuItem value="S2">S2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Tầng"
                fullWidth
                type="number"
                value={newApartment.floor}
                onChange={(e) => setNewApartment({ ...newApartment, floor: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Chủ căn hộ"
                fullWidth
                value={newApartment.ownerName}
                onChange={(e) => setNewApartment({ ...newApartment, ownerName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Số người ở"
                fullWidth
                type="number"
                value={newApartment.numResidents}
                onChange={(e) => setNewApartment({ ...newApartment, numResidents: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Số chìa khóa"
                fullWidth
                type="number"
                value={newApartment.numKeys}
                onChange={(e) => setNewApartment({ ...newApartment, numKeys: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Số chỗ để xe máy"
                fullWidth
                type="number"
                value={newApartment.parkingSlots.bike}
                onChange={(e) => setNewApartment({
                  ...newApartment,
                  parkingSlots: {
                    ...newApartment.parkingSlots,
                    bike: Number(e.target.value)
                  }
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Số chỗ để ô tô"
                fullWidth
                type="number"
                value={newApartment.parkingSlots.car}
                onChange={(e) => setNewApartment({
                  ...newApartment,
                  parkingSlots: {
                    ...newApartment.parkingSlots,
                    car: Number(e.target.value)
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={3}
                value={newApartment.notes}
                onChange={(e) => setNewApartment({ ...newApartment, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddApartment}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleAddApartment}
            disabled={!newApartment.apartmentNumber || !newApartment.building}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa phương tiện */}
      <Dialog open={deleteVehicleDialogOpen} onClose={handleCloseDeleteVehicle}>
        <DialogTitle>Xác nhận xóa phương tiện</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn xóa phương tiện {selectedVehicle?.type} - {selectedVehicle?.licensePlate}?
            Hành động này không thể hoàn tác.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteVehicle}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteVehicle}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa phương tiện */}
      <Dialog open={editVehicleDialogOpen} onClose={handleCloseEditVehicle}>
        <DialogTitle>Chỉnh sửa thông tin phương tiện</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại phương tiện</InputLabel>
                <Select
                  value={editingVehicle?.type || ''}
                  label="Loại phương tiện"
                  onChange={(e) => setEditingVehicle(prev => 
                    prev ? { ...prev, type: e.target.value as 'Ô tô' | 'Xe máy' } : null
                  )}
                >
                  <MenuItem value="Ô tô">Ô tô</MenuItem>
                  <MenuItem value="Xe máy">Xe máy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Biển số xe"
                fullWidth
                value={editingVehicle?.licensePlate || ''}
                onChange={(e) => setEditingVehicle(prev => 
                  prev ? { ...prev, licensePlate: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Hãng xe"
                fullWidth
                value={editingVehicle?.brand || ''}
                onChange={(e) => setEditingVehicle(prev => 
                  prev ? { ...prev, brand: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Model"
                fullWidth
                value={editingVehicle?.model || ''}
                onChange={(e) => setEditingVehicle(prev => 
                  prev ? { ...prev, model: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Màu sắc"
                fullWidth
                value={editingVehicle?.color || ''}
                onChange={(e) => setEditingVehicle(prev => 
                  prev ? { ...prev, color: e.target.value } : null
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditVehicle}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateVehicle}
            disabled={!editingVehicle?.type || !editingVehicle?.licensePlate}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApartmentDetailsManagement; 