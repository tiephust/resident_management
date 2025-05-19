import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';
import { ApartmentDetail } from '../../../types/admin/ApartmentManagementType';

interface DeleteApartmentDialogProps {
    open: boolean;
    apartment: ApartmentDetail | null;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteApartmentDialog: React.FC<DeleteApartmentDialogProps> = ({
                                                                         open,
                                                                         apartment,
                                                                         onClose,
                                                                         onDelete,
                                                                     }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Bạn có chắc chắn muốn xóa thông tin căn hộ {apartment?.building} - {apartment?.apartmentNumber}?
                    Hành động này không thể hoàn tác.
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" color="error" onClick={onDelete}>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteApartmentDialog;