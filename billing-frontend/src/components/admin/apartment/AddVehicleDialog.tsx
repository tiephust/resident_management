import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Vehicle } from '../../../types/admin/ApartmentManagementType';

interface AddVehicleDialogProps {
    open: boolean;
    newVehicle: Partial<Vehicle>;
    setNewVehicle: React.Dispatch<React.SetStateAction<Partial<Vehicle>>>;
    onClose: () => void;
    onAdd: () => void;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
                                                               open,
                                                               newVehicle,
                                                               setNewVehicle,
                                                               onClose,
                                                               onAdd,
                                                           }) => {
    return (
        <Dialog open={open} onClose={onClose}>
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
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onAdd}>
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVehicleDialog;