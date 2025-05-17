import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onDelete: () => void;
    deleteButtonText?: string;
    cancelButtonText?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    open,
    title,
    content,
    onClose,
    onDelete,
    deleteButtonText = 'Xóa',
    cancelButtonText = 'Hủy'
}) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{cancelButtonText}</Button>
                <Button 
                    onClick={onDelete} 
                    color="error" 
                    variant="contained"
                    autoFocus
                >
                    {deleteButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;