import React from 'react';
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
} from '@mui/material';
import { FeeType, NewFeeType } from '../../types/admin/FeeTypeManagementType';

const categoryConfig = {
    'Dịch vụ cơ bản': 'Basic Services',
    'Dịch vụ chung': 'Common Services',
    'Phí quản lý': 'Management Fees'
};

const billingCycleConfig = {
    'Hàng tháng': 'Monthly',
    'Hàng quý': 'Quarterly',
    'Hàng năm': 'Yearly'
};

interface FeeTypeDialogProps {
    open: boolean;
    feeType: FeeType | NewFeeType | null;
    setFeeType: React.Dispatch<React.SetStateAction<FeeType | NewFeeType | null>>;
    onClose: () => void;
    onSave: () => void;
}

const FeeTypeDialog: React.FC<FeeTypeDialogProps> = ({
    open,
    feeType,
    setFeeType,
    onClose,
    onSave,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {feeType && 'id' in feeType
                    ? 'Chỉnh sửa loại phí'
                    : 'Thêm loại phí mới'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Tên loại phí"
                        fullWidth
                        value={feeType?.name || ''}
                        onChange={(e) =>
                            setFeeType((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                            )
                        }
                    />
                    <FormControl fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={feeType?.category || ''}
                            label="Danh mục"
                            onChange={(e) =>
                                setFeeType((prev) =>
                                    prev ? { ...prev, category: e.target.value } : null
                                )
                            }
                        >
                            {Object.keys(categoryConfig).map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Đơn vị tính"
                        fullWidth
                        value={feeType?.unit || ''}
                        onChange={(e) =>
                            setFeeType((prev) =>
                                prev ? { ...prev, unit: e.target.value } : null
                            )
                        }
                        helperText="Ví dụ: m³, kWh, căn hộ, người"
                    />
                    <TextField
                        label="Đơn giá"
                        fullWidth
                        type="number"
                        value={feeType?.pricePerUnit || ''}
                        onChange={(e) =>
                            setFeeType((prev) =>
                                prev
                                    ? { ...prev, pricePerUnit: parseFloat(e.target.value) }
                                    : null
                            )
                        }
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Chu kỳ thu</InputLabel>
                        <Select
                            value={feeType?.billingCycle || ''}
                            label="Chu kỳ thu"
                            onChange={(e) =>
                                setFeeType((prev) =>
                                    prev ? { ...prev, billingCycle: e.target.value } : null
                                )
                            }
                        >
                            {Object.keys(billingCycleConfig).map((cycle) => (
                                <MenuItem key={cycle} value={cycle}>
                                    {cycle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        value={feeType?.description || ''}
                        onChange={(e) =>
                            setFeeType((prev) =>
                                prev ? { ...prev, description: e.target.value } : null
                            )
                        }
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onSave}>
                    {feeType && 'id' in feeType
                        ? 'Lưu thay đổi'
                        : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeeTypeDialog; 