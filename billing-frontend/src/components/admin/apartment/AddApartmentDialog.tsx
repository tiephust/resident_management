import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
} from '@mui/material';
import { NewApartmentDTO } from '../../../types/admin/ApartmentServiceType';

interface AddApartmentDialogProps {
    open: boolean;
    newApartment: NewApartmentDTO;
    setNewApartment: React.Dispatch<React.SetStateAction<NewApartmentDTO>>;
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
                    <Grid item xs={12}>
                        <TextField
                            label="Tên căn hộ"
                            fullWidth
                            required
                            value={newApartment.name}
                            onChange={(e) => setNewApartment({ ...newApartment, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="ID chủ căn hộ"
                            fullWidth
                            type="number"
                            required
                            value={newApartment.apartmentOwnerId}
                            onChange={(e) => setNewApartment({ ...newApartment, apartmentOwnerId: Number(e.target.value) })}
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