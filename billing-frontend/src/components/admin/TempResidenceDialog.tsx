import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
} from '@mui/material';
import AddUserDialog from './common/AddUserDialog';
import { Resident, NewResident } from '../../types/admin/ResidentManagementType';
import { TextField } from '@mui/material';

const roleConfig: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
    RESIDENT: { label: 'Cư dân', color: 'success' },
    TEMPORARY: { label: 'Tạm trú', color: 'warning' },
    GUEST: { label: 'Khách', color: 'info' },
};

interface TempResidenceDialogProps {
    open: boolean;
    resident: Resident | NewResident | null;
    setResident: React.Dispatch<React.SetStateAction<Resident | NewResident | null>>;
    onClose: () => void;
    onSave: () => void;
}

const TempResidenceDialog: React.FC<TempResidenceDialogProps> = ({
                                                                     open,
                                                                     resident,
                                                                     setResident,
                                                                     onClose,
                                                                     onSave,
                                                                 }) => {
    const additionalFields = (
        <>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Căn hộ"
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
                    label="Ngày bắt đầu thuê"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={resident?.leaseStartDate || ''}
                    onChange={(e) => setResident({ ...resident!, leaseStartDate: e.target.value })}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Ngày kết thúc thuê"
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
                        value={resident?.role || 'TEMPORARY'}
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
        </>
    );

    return (
        <AddUserDialog
            open={open}
            resident={resident}
            setResident={setResident}
            onClose={onClose}
            onSave={onSave}
            dialogTitle="Khai báo tạm trú"
            additionalFields={additionalFields}
        />
    );
};

export default TempResidenceDialog;