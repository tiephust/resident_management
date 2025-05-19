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
import { FeeDTO } from '../../types/fee';
import { managementFeeTypeService } from '../../services/admin/ManagementFeeTypeService';
import { managementApartmentService } from '../../services/admin/ManageApartmentService';

interface FeeDialogProps {
    open: boolean;
    fee: FeeDTO | null;
    setFee: React.Dispatch<React.SetStateAction<FeeDTO | null>>;
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
    const [apartments, setApartments] = useState<Array<{ id: number; name: string; building: string }>>([]);
    const [feeTypes, setFeeTypes] = useState<Array<{ id: number; name: string; pricePerUnit: number }>>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [apartmentsData, feeTypesData] = await Promise.all([
                    managementApartmentService.getAllApartments(),
                    managementFeeTypeService.getAllFeeTypes(),
                ]);
                setApartments(Array.isArray(apartmentsData) ? apartmentsData : []);
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
                feeTypeId,
                amount: selectedFeeType.pricePerUnit,
            });
        }
    };

    const validateForm = (): boolean => {
        if (!fee) {
            setError('Dữ liệu khoản phí không hợp lệ');
            return false;
        }
        if (!fee.apartmentId) {
            setError('Vui lòng chọn căn hộ');
            return false;
        }
        if (!fee.feeTypeId) {
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

    const hasId = fee && fee.id;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {hasId ? 'Chỉnh sửa khoản phí' : 'Thêm khoản phí mới'}
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
                                <InputLabel>Căn hộ</InputLabel>
                                <Select
                                    value={fee?.apartmentId || ''}
                                    label="Căn hộ"
                                    onChange={(e) =>
                                        setFee((prev) =>
                                            prev ? { ...prev, apartmentId: e.target.value as number } : null
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {Array.isArray(apartments) && apartments.length > 0 ? (
                                        apartments.map((apartment) => (
                                            <MenuItem key={apartment.id} value={apartment.id}>
                                                {apartment.building} - {apartment.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Không có căn hộ</MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Loại phí</InputLabel>
                                <Select
                                    value={fee?.feeTypeId || ''}
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
                                value={fee?.dueDate ? fee.dueDate.split('T')[0] : ''}
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
                                label="Ngày thanh toán"
                                type="date"
                                fullWidth
                                value={fee?.paymentDate ? fee.paymentDate.split('T')[0] : ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, paymentDate: e.target.value || null } : null
                                    )
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={loading}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={fee?.status || ''}
                                    label="Trạng thái"
                                    onChange={(e) =>
                                        setFee((prev) =>
                                            prev ? { ...prev, status: e.target.value as 'PAID' | 'UNPAID' | 'OVERDUE' } : null
                                        )
                                    }
                                    disabled={loading}
                                >
                                    <MenuItem value="PAID">Đã đóng</MenuItem>
                                    <MenuItem value="UNPAID">Chưa đóng</MenuItem>
                                    <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                                value={fee?.description || ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, description: e.target.value || null } : null
                                    )
                                }
                                disabled={loading}
                            />

                            <TextField
                                label="Stripe Payment Intent ID"
                                fullWidth
                                value={fee?.stripePaymentIntentId || ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, stripePaymentIntentId: e.target.value || null } : null
                                    )
                                }
                                disabled={loading}
                            />

                            <TextField
                                label="Trạng thái thanh toán Stripe"
                                fullWidth
                                value={fee?.stripePaymentStatus || ''}
                                onChange={(e) =>
                                    setFee((prev) =>
                                        prev ? { ...prev, stripePaymentStatus: e.target.value || null } : null
                                    )
                                }
                                disabled={loading}
                            />

                            {hasId && (
                                <>
                                    <TextField
                                        label="Ngày tạo"
                                        fullWidth
                                        value={fee?.createdAt ? fee.createdAt.split('T')[0] : ''}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                    <TextField
                                        label="Ngày cập nhật"
                                        fullWidth
                                        value={fee?.updatedAt ? fee.updatedAt.split('T')[0] : ''}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </>
                            )}
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={loading}>
                    {hasId ? 'Lưu thay đổi' : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeeDialog;