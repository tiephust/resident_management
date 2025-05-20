import React, { useEffect, useState } from 'react';
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
import { Fee, NewFee } from '../../types/admin/FeeManagementType';
import { FeeType } from '../../types/admin/FeeTypeManagementType';
import { managementFeeTypeService } from '../../services/admin/ManagementFeeTypeService';
import { managementApartmentService } from '../../services/admin/ManageApartmentService';
import { ApartmentDTO } from '../../types/admin/ApartmentServiceType';

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
    const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
    const [apartments, setApartments] = useState<ApartmentDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [feeTypesData, apartmentsData] = await Promise.all([
                    managementFeeTypeService.getAllFeeTypes(),
                    managementApartmentService.getAllApartments()
                ]);
                setFeeTypes(feeTypesData);
                setApartments(apartmentsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            loadData();
        }
    }, [open]);

    const statusOptions = [
        { value: 'PAID', label: 'Đã đóng' },
        { value: 'UNPAID', label: 'Chưa đóng' },
        { value: 'OVERDUE', label: 'Quá hạn' },
    ];

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Kiểm tra xem fee có id hay không (tức là FeeDTO, không phải NewFeeDTO)
    const hasId = fee && 'id' in fee;

    const handleFeeTypeChange = (feeTypeId: number) => {
        if (fee) {
            const selectedFeeType = feeTypes.find(ft => ft.id === feeTypeId);
            if (selectedFeeType) {
                setFee({
                    ...fee,
                    feeTypeId: selectedFeeType.id,
                    amount: selectedFeeType.pricePerUnit
                });
            }
        }
    };

    const handleApartmentChange = (apartmentId: number) => {
        if (fee) {
            setFee({
                ...fee,
                apartmentId: apartmentId
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {hasId ? 'Chỉnh sửa phí' : 'Thêm phí mới'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Căn hộ</InputLabel>
                        <Select
                            value={fee?.apartmentId || ''}
                            label="Căn hộ"
                            onChange={(e) => handleApartmentChange(Number(e.target.value))}
                            required
                        >
                            {apartments.map((apartment) => (
                                <MenuItem key={apartment.id} value={apartment.id}>
                                    {apartment.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Loại phí</InputLabel>
                        <Select
                            value={fee?.feeTypeId || ''}
                            label="Loại phí"
                            onChange={(e) => handleFeeTypeChange(Number(e.target.value))}
                            required
                        >
                            {feeTypes.map((feeType) => (
                                <MenuItem key={feeType.id} value={feeType.id}>
                                    {feeType.name} - {feeType.category} ({feeType.unit})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Số tiền"
                        fullWidth
                        type="number"
                        value={fee?.amount || ''}
                        onChange={(e) =>
                            fee && setFee({ ...fee, amount: Number(e.target.value) })
                        }
                        required
                    />
                    <TextField
                        label="Hạn đóng"
                        fullWidth
                        type="datetime-local"
                        value={formatDateForInput(fee?.dueDate || '')}
                        onChange={(e) =>
                            fee && setFee({ ...fee, dueDate: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={fee?.status || 'UNPAID'}
                            label="Trạng thái"
                            onChange={(e) =>
                                fee &&
                                setFee({
                                    ...fee,
                                    status: e.target.value as 'PAID' | 'UNPAID' | 'OVERDUE',
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
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        value={fee?.description || ''}
                        onChange={(e) =>
                            fee && setFee({ ...fee, description: e.target.value })
                        }
                    />
                    {hasId && (
                        <>
                            <TextField
                                label="Ngày tạo"
                                fullWidth
                                value={formatDateForDisplay(fee?.createdAt || '')}
                                InputProps={{ readOnly: true }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Ngày cập nhật"
                                fullWidth
                                value={formatDateForDisplay(fee?.updatedAt || '')}
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

export default FeeDialog;