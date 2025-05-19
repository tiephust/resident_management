import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
} from '@mui/material';
import { Vehicle } from '../../../types/admin/ApartmentManagementType';

interface DeleteVehicleDialogProps {
    open: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
    open,
    vehicle,
    onClose,
    onDelete,
}) => {
    if (!vehicle) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Xóa phương tiện</DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Bạn có chắc chắn muốn xóa phương tiện {vehicle.type} với biển số {vehicle.licensePlate}?
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onDelete} variant="contained" color="error">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteVehicleDialog;
