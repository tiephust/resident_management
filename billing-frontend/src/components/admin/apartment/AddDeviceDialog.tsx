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
import { NewDevice } from '../../../types/admin/DeviceManagementType';

interface AddDeviceDialogProps {
    open: boolean;
    newDevice: NewDevice;
    setNewDevice: (device: NewDevice) => void;
    onClose: () => void;
    onAdd: () => void;
}

const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({
    open,
    newDevice,
    setNewDevice,
    onClose,
    onAdd,
}) => {
    const handleChange = (field: keyof NewDevice) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDevice({
            ...newDevice,
            [field]: event.target.value,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm thiết bị mới</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Tên thiết bị"
                        value={newDevice.name}
                        onChange={handleChange('name')}
                        fullWidth
                        required
                    />
                    <TextField
                        select
                        label="Loại thiết bị"
                        value={newDevice.type}
                        onChange={handleChange('type')}
                        fullWidth
                        required
                    >
                        <MenuItem value="Camera">Camera</MenuItem>
                        <MenuItem value="Khóa thông minh">Khóa thông minh</MenuItem>
                        <MenuItem value="Cảm biến">Cảm biến</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Trạng thái"
                        value={newDevice.status}
                        onChange={handleChange('status')}
                        fullWidth
                        required
                    >
                        <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                        <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                        <MenuItem value="BROKEN">Hỏng</MenuItem>
                    </TextField>
                    <TextField
                        label="Ngày bảo trì gần nhất"
                        type="date"
                        value={newDevice.maintenanceAt}
                        onChange={handleChange('maintenanceAt')}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button
                    onClick={onAdd}
                    variant="contained"
                    color="primary"
                    disabled={!newDevice.name || !newDevice.type || !newDevice.status || !newDevice.maintenanceAt}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDeviceDialog;
