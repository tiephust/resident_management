import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Resident, NewResident } from '../../types/admin/ResidentManagementType';

const roleConfig: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
    RESIDENT: { label: 'Cư dân', color: 'success' },
    TEMPORARY: { label: 'Tạm trú', color: 'warning' },
    GUEST: { label: 'Khách', color: 'info' },
};

interface EditResidentDialogProps {
    open: boolean;
    resident: Resident | null;
    setResident: React.Dispatch<React.SetStateAction<Resident | NewResident | null>>;
    onClose: () => void;
    onSave: () => void;
}

const EditResidentDialog: React.FC<EditResidentDialogProps> = ({
                                                                   open,
                                                                   resident,
                                                                   setResident,
                                                                   onClose,
                                                                   onSave,
                                                               }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Sửa thông tin cư dân</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            required
                            value={resident?.name || ''}
                            onChange={(e) => setResident({ ...resident!, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            required
                            value={resident?.email || ''}
                            onChange={(e) => setResident({ ...resident!, email: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            value={resident?.phoneNumber || ''}
                            onChange={(e) => setResident({ ...resident!, phoneNumber: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giới tính</InputLabel>
                            <Select
                                value={resident?.gender || ''}
                                label="Giới tính"
                                onChange={(e) => setResident({ ...resident!, gender: e.target.value })}
                            >
                                <MenuItem value="">Chọn giới tính</MenuItem>
                                <MenuItem value="MALE">Nam</MenuItem>
                                <MenuItem value="FEMALE">Nữ</MenuItem>
                                <MenuItem value="OTHER">Khác</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="CCCD"
                            value={resident?.unitNumber || ''}
                            onChange={(e) => setResident({ ...resident!, unitNumber: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày sinh"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={resident?.birthday || ''}
                            onChange={(e) => setResident({ ...resident!, birthday: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Quê quán"
                            value={resident?.hometown || ''}
                            onChange={(e) => setResident({ ...resident!, hometown: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Địa chỉ"
                            value={resident?.address || ''}
                            onChange={(e) => setResident({ ...resident!, address: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mô tả"
                            multiline
                            rows={2}
                            value={resident?.description || ''}
                            onChange={(e) => setResident({ ...resident!, description: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Phòng ban"
                            required
                            value={resident?.department || ''}
                            onChange={(e) => setResident({ ...resident!, department: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Stripe Customer ID"
                            value={resident?.stripeCustomerId || ''}
                            onChange={(e) => setResident({ ...resident!, stripeCustomerId: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày bắt đầu"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={resident?.leaseStartDate || ''}
                            onChange={(e) => setResident({ ...resident!, leaseStartDate: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày kết thúc"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={resident?.leaseEndDate || ''}
                            onChange={(e) => setResident({ ...resident!, leaseEndDate: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                value={resident?.role || 'RESIDENT'}
                                label="Vai trò"
                                onChange={(e) => setResident({ ...resident!, role: e.target.value })}
                            >
                                {Object.keys(roleConfig).map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {roleConfig[role].label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onSave}>Lưu thay đổi</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditResidentDialog;