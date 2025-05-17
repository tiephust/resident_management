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
import { Resident } from '../../types/admin/ResidentManagementType';

interface TempLeaveDialogProps {
    open: boolean;
    resident: Resident | null;
    onClose: () => void;
}

const TempLeaveDialog: React.FC<TempLeaveDialogProps> = ({ open, resident, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
                Chi tiết thông tin tạm vắng
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            required
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                            value={resident?.name || ''}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày sinh"
                            type="text"
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="CCCD"
                            required
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giới tính</InputLabel>
                            <Select
                                value=""
                                label="Giới tính"
                                disabled
                                sx={{ bgcolor: '#f5f5f5' }}
                            >
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Địa chỉ thường trú"
                            multiline
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Địa chỉ nơi đến" multiline />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                            value={resident?.phoneNumber || ''}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Nghề nghiệp"
                            InputProps={{
                                readOnly: true,
                                sx: { bgcolor: '#f5f5f5' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày bắt đầu"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Ngày kết thúc"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Chung cư</InputLabel>
                            <Select
                                value="S1"
                                label="Chung cư"
                                disabled
                                sx={{ bgcolor: '#f5f5f5' }}
                            >
                                <MenuItem value="S1">S1</MenuItem>
                                <MenuItem value="S2">S2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Lý do" multiline rows={2} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined">
                    Hủy
                </Button>
                <Button variant="contained" onClick={onClose}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TempLeaveDialog;