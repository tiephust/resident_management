import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { Resident } from '../../types/admin/ResidentManagementType';

interface DeleteConfirmationDialogProps {
    open: boolean;
    resident: Resident | null;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
                                                                               open,
                                                                               resident,
                                                                               onClose,
                                                                               onDelete,
                                                                           }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
                Bạn có chắc chắn muốn xóa cư dân {resident?.name} không?
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

export default DeleteConfirmationDialog;