import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Fee, NewFee } from '../../types/admin/FeeManagementType';
import { managementFeeTypeService } from '../../services/admin/ManagementFeeTypeService';
import { managementResidentService } from '../../services/admin/ManagementResidentService';

interface FeeDialogProps {
    open: boolean;
    fee: Fee | NewFee | null;
    setFee: React.Dispatch<React.SetStateAction<Fee | NewFee | null>>;
    onClose: () => void;
    onSave: () => void;
}

const FeeDialog: React.FC<FeeDialogProps> = ({
                                                 open,
                                                 fee,
                                                 setFee,
                                                 onClose,
                                                 onSave,
                                             }) => {
    const [residents, setResidents] = useState<Array<{ id: number; name: string }>>([]);
    const [feeTypes, setFeeTypes] = useState<Array<{ id: number; name: string; pricePerUnit: number }>>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [residentsData, feeTypesData] = await Promise.all([
                    managementResidentService.getAllResidents(),
                    managementFeeTypeService.getAllFeeTypes(),
                ]);
                // Đảm bảo residentsData là mảng
                setResidents(Array.isArray(residentsData) ? residentsData : []);
                setFeeTypes(Array.isArray(feeTypesData) ? feeTypesData : []);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        if (open) {
            loadData();
        }
    }, [open]);

    const handleFeeTypeChange = (feeTypeId: number) => {
        const selectedFeeType = feeTypes.find(ft => ft.id === feeTypeId);
        if (selectedFeeType && fee) {
            setFee({
                ...fee,
                feeType: { id: feeTypeId },
                amount: selectedFeeType.pricePerUnit,
            });
        }
    };

    const validateForm = (): boolean => {
        if (!fee) {
            setError('Dữ liệu khoản phí không hợp lệ');
            return false;
        }
        if (!fee.resident?.id) {
            setError('Vui lòng chọn cư dân');
            return false;
        }
        if (!fee.feeType?.id) {
            setError('Vui lòng chọn loại phí');
            return false;
        }
        if (!fee.amount || fee.amount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ');
            return false;
        }
        if (!fee.dueDate) {
            setError('Vui lòng chọn hạn đóng');
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {fee && 'id' in fee ? 'Chỉnh sửa khoản phí' : 'Thêm khoản phí mới'}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Cư dân</InputLabel>
                                <Select
                                    value={fee?.resident?.id || ''}
                                    label="Cư dân"
                                    onChange={(e) =>
                                        setFee((prev) =>
                                            prev ? { ...prev, resident: { id: e.target.value as number } } : null
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {Array.isArray(residents) && residents.length > 0 ? (
                                        residents.map((resident) => (
                                            <MenuItem key={resident.id} value={resident.id}>
                                                {resident.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có cư dân</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Loại phí</InputLabel>
                                <Select
                                    value={fee?.feeType?.id || ''}
                                    label="Loại phí"
                                    onChange={(e) => handleFeeTypeChange(e.target.value as number)}
                                    disabled={loading}
                                >
                                    {Array.isArray(feeTypes) && feeTypes.length > 0 ? (
                                        feeTypes.map((feeType) => (
                                            <MenuItem key={feeType.id} value={feeType.id}>
                                                {feeType.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có loại phí</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Số tiền"
                                fullWidth
                                type="number"
                                value={fee?.amount || ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, amount: parseFloat(e.target.value) } : null
                                    )
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                }}
                                disabled={loading}
                            />

                            <TextField
                                label="Hạn đóng"
                                type="date"
                                fullWidth
                                value={fee?.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, dueDate: e.target.value } : null
                                    )
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={loading}
                            />

                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                                value={fee?.description || ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, description: e.target.value } : null
                                    )
                                }
                                disabled={loading}
                            />
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={loading}>
                    {fee && 'id' in fee ? 'Lưu thay đổi' : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeeDialog;