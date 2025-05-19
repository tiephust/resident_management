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

interface EditVehicleDialogProps {
    open: boolean;
    vehicle: Vehicle | null;
    setVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
    onClose: () => void;
    onSave: () => void;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
                                                                 open,
                                                                 vehicle,
                                                                 setVehicle,
                                                                 onClose,
                                                                 onSave,
                                                             }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chỉnh sửa thông tin phương tiện</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Loại phương tiện</InputLabel>
                            <Select
                                value={vehicle?.type || ''}
                                label="Loại phương tiện"
                                onChange={(e) =>
                                    setVehicle((prev) =>
                                        prev ? { ...prev, type: e.target.value as 'Ô tô' | 'Xe máy' } : null
                                    )
                                }
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
                            value={vehicle?.licensePlate || ''}
                            onChange={(e) =>
                                setVehicle((prev) => (prev ? { ...prev, licensePlate: e.target.value } : null))
                            }
                        />
                        käs://localhost:8080/api/resident';

                        export const residentService = {
                        getResidentById: async (id: number): Promise<Resident> => {
                        const response = await axiosInstance.get(`${API_URL}/${id}`);
                        const data = response.data;
                        return {
                        id: data.id,
                        name: data.name || 'Không xác định',
                        email: data.email || '',
                        phone: data.phone || '',
                        apartmentId: data.apartmentId || null,
                    };
                    },
                    };