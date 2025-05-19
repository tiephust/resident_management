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
import { NewApartment } from '../../../types/admin/ApartmentManagementType';

interface AddApartmentDialogProps {
    open: boolean;
    newApartment: NewApartment;
    setNewApartment: React.Dispatch<React.SetStateAction<NewApartment>>;
    onClose: () => void;
    onAdd: () => void;
}

const AddApartmentDialog: React.FC<AddApartmentDialogProps> = ({
    open,
    newApartment,
    setNewApartment,
    onClose,
    onAdd,
}) => {
    const handleParkingSlotsChange = (type: 'car' | 'bike', value: number) => {
        setNewApartment({
            ...newApartment,
            parkingSlots: {
                car: type === 'car' ? value : (newApartment.parkingSlots?.car || 0),
                bike: type === 'bike' ? value : (newApartment.parkingSlots?.bike || 0),
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Thêm căn hộ mới</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            label="Số căn hộ"
                            fullWidth
                            required
                            value={newApartment.name}
                            onChange={(e) => setNewApartment({ ...newApartment, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Tòa nhà</InputLabel>
                            <Select
                                value={newApartment.building || 'S1'}
                                label="Tòa nhà"
                                onChange={(e) => setNewApartment({ ...newApartment, building: e.target.value as 'S1' | 'S2' })}
                            >
                                <MenuItem value="S1">S1</MenuItem>
                                <MenuItem value="S2">S2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="ID chủ căn hộ"
                            fullWidth
                            type="number"
                            value={newApartment.apartmentOwnerId}
                            onChange={(e) => setNewApartment({ ...newApartment, apartmentOwnerId: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Tầng"
                            fullWidth
                            type="number"
                            value={newApartment.floor || 1}
                            onChange={(e) => setNewApartment({ ...newApartment, floor: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Số chỗ để ô tô"
                            fullWidth
                            type="number"
                            value={newApartment.parkingSlots?.car || 0}
                            onChange={(e) => handleParkingSlotsChange('car', Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Số chỗ để xe máy"
                            fullWidth
                            type="number"
                            value={newApartment.parkingSlots?.bike || 0}
                            onChange={(e) => handleParkingSlotsChange('bike', Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Ghi chú"
                            fullWidth
                            multiline
                            rows={3}
                            value={newApartment.description || ''}
                            onChange={(e) => setNewApartment({ ...newApartment, description: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={onAdd}
                    disabled={!newApartment.name || !newApartment.apartmentOwnerId}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddApartmentDialog;