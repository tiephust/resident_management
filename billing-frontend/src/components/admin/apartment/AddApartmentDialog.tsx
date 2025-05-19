import React, { useState, useEffect } from 'react';
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
import { NewApartmentDTO } from '../../../types/admin/ApartmentServiceType';
import { Resident } from '../../../types/admin/ResidentManagementType';
import { managementResidentService } from '../../../services/admin/ManagementResidentService';

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
    const [residents, setResidents] = useState<Resident[]>([]);

    useEffect(() => {
        const loadResidents = async () => {
            if (open) {
                try {
                    const data = await managementResidentService.getAllResidents();
                    setResidents(data);
                } catch (error) {
                    console.error('Error loading residents:', error);
                }
            }
        };
        loadResidents();
    }, [open]);

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
                        <FormControl fullWidth required>
                            <InputLabel>Chủ căn hộ</InputLabel>
                            <Select
                                value={newApartment.apartmentOwnerId || ''}
                                label="Chủ căn hộ"
                                onChange={(e) => setNewApartment({ 
                                    ...newApartment, 
                                    apartmentOwnerId: e.target.value as number 
                                })}
                            >
                                {residents.map((resident) => (
                                    <MenuItem key={resident.id} value={resident.id}>
                                        {resident.name} - {resident.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Ghi chú"
                            fullWidth
                            multiline
                            rows={3}
                            required
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
                    disabled={!newApartment.name || !newApartment.apartmentOwnerId || !newApartment.description}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddApartmentDialog;