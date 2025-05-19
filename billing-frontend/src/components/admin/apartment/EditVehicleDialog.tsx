import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
} from '@mui/material';
import { Vehicle } from '../../../types/admin/ApartmentManagementType';

interface EditVehicleDialogProps {
    open: boolean;
    vehicle: Vehicle | null;
    setVehicle: (vehicle: Vehicle | null) => void;
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
    if (!vehicle) return null;

    const handleChange = (field: keyof Vehicle) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setVehicle({
            ...vehicle,
            [field]: event.target.value,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh sửa phương tiện</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        select
                        label="Loại phương tiện"
                        value={vehicle.type}
                        onChange={handleChange('type')}
                        fullWidth
                    >
                        <MenuItem value="Ô tô">Ô tô</MenuItem>
                        <MenuItem value="Xe máy">Xe máy</MenuItem>
                    </TextField>
                    <TextField
                        label="Biển số xe"
                        value={vehicle.licensePlate}
                        onChange={handleChange('licensePlate')}
                        fullWidth
                    />
                    <TextField
                        label="Hãng xe"
                        value={vehicle.brand}
                        onChange={handleChange('brand')}
                        fullWidth
                    />
                    <TextField
                        label="Model"
                        value={vehicle.model}
                        onChange={handleChange('model')}
                        fullWidth
                    />
                    <TextField
                        label="Màu sắc"
                        value={vehicle.color}
                        onChange={handleChange('color')}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onSave} variant="contained" color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditVehicleDialog;