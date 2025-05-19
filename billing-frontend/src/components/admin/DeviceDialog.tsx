import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { DeviceDialogProps } from '../../types/admin/DeviceManagementType';

const DeviceDialog: React.FC<DeviceDialogProps> = ({
                                                       open,
                                                       device,
                                                       setDevice,
                                                       onClose,
                                                       onSave,
                                                   }) => {
    const statusOptions = [
        { value: 'ACTIVE', label: 'Hoạt động' },
        { value: 'MAINTENANCE', label: 'Bảo trì' },
        { value: 'BROKEN', label: 'Hỏng' },
    ];

    // Kiểm tra xem device có id hay không (tức là Device, không phải NewDevice)
    const hasId = device && 'id' in device;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {hasId ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Tên thiết bị"
                        fullWidth
                        value={device?.name || ''}
                        onChange={(e) =>
                            device && setDevice({ ...device, name: e.target.value })
                        }
                        required
                    />
                    <TextField
                        label="Loại thiết bị"
                        fullWidth
                        value={device?.type || ''}
                        onChange={(e) =>
                            device && setDevice({ ...device, type: e.target.value })
                        }
                        required
                    />
                    <TextField
                        label="Số thẻ"
                        fullWidth
                        value={device?.numberCard || ''}
                        onChange={(e) =>
                            device && setDevice({ ...device, numberCard: e.target.value })
                        }
                    />
                    <TextField
                        label="ID căn hộ"
                        fullWidth
                        type="number"
                        value={device?.apartmentId || ''}
                        onChange={(e) =>
                            device &&
                            setDevice({
                                ...device,
                                apartmentId: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                    />
                    <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={device?.status || 'ACTIVE'}
                            label="Trạng thái"
                            onChange={(e) =>
                                device &&
                                setDevice({
                                    ...device,
                                    status: e.target.value as 'ACTIVE' | 'MAINTENANCE' | 'BROKEN',
                                })
                            }
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Ngày bảo trì gần nhất"
                        fullWidth
                        type="date"
                        value={device?.maintenanceAt || ''}
                        onChange={(e) =>
                            device && setDevice({ ...device, maintenanceAt: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        value={device?.description || ''}
                        onChange={(e) =>
                            device && setDevice({ ...device, description: e.target.value })
                        }
                    />
                    {hasId && (
                        <>
                            <TextField
                                label="Ngày tạo"
                                fullWidth
                                value={device?.createdAt || ''}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Ngày cập nhật"
                                fullWidth
                                value={device?.updatedAt || ''}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onSave}>
                    {hasId ? 'Lưu thay đổi' : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeviceDialog;