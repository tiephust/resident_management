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
import { ApartmentDetail } from '../../../types/admin/ApartmentManagementType';

interface AddApartmentDialogProps {
    open: boolean;
    newApartment: Partial<Omit<ApartmentDetail, 'id' | 'vehicles'>> & { parkingSlots: { car: number; bike: number } };
    setNewApartment: React.Dispatch<React.SetStateAction<Partial<Omit<ApartmentDetail, 'id' | 'vehicles'>> & { parkingSlots: { car: number; bike: number } }>>;
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
                                itm xs={6}>
                                <TextField
                                    label="Số chỗ để ô tô"
                                    fullWidth
                                    type="number"
                                    value={newApartment.parkingSlots.car}
                                    onChange={(e) =>
                                        setNewApartment({
                                            ...newApartment,
                                            parkingSlots: {
                                                ...newApartment.parkingSlots,
                                                car: Number(e.target.value),
                                            },
                                        })
                                    }
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
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={onAdd}
                    disabled={!newApartment.apartmentNumber || !newApartment.building}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
);
};

export default AddApartmentDialog;