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
import { Resident } from '../../../types/admin/ResidentManagementType';

type NewResident = Omit<Resident, 'createdAt' | 'updatedAt' | 'deletedAt' | 'bills'>;

interface AddUserDialogProps {
    open: boolean;
    resident: Resident | NewResident | null;
    setResident: React.Dispatch<React.SetStateAction<Resident | NewResident | null>>;
    onClose: () => void;
    onSave: () => void;
    dialogTitle: string;
    additionalFields?: React.ReactNode;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
                                                         open,
                                                         resident,
                                                         setResident,
                                                         onClose,
                                                         onSave,
                                                         dialogTitle,
                                                         additionalFields,
                                                     }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
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
                            label="Mật khẩu"
                            type="password"
                            required
                            value={resident?.password || '1'}
                            onChange={(e) => setResident({ ...resident!, password: e.target.value })}
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
                    {additionalFields}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onSave}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserDialog;