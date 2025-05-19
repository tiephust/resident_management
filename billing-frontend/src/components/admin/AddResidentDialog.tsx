import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddUserDialog from './common/AddUserDialog';
import { Resident, NewResident } from '../../types/admin/ResidentManagementType';
import { apartmentService } from '../../services/admin/apartmentService';

const roleConfig: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
    RESIDENT: { label: 'Cư dân', color: 'success' },
    TEMPORARY: { label: 'Tạm trú', color: 'warning' },
    GUEST: { label: 'Khách', color: 'info' },
};

interface Apartment {
    id: number;
    number: string;
    building: string;
}

interface AddResidentDialogProps {
    open: boolean;
    resident: Resident | NewResident | null;
    setResident: React.Dispatch<React.SetStateAction<Resident | NewResident | null>>;
    onClose: () => void;
    onSave: () => void;
}

const AddResidentDialog: React.FC<AddResidentDialogProps> = ({
    open,
    resident,
    setResident,
    onClose,
    onSave,
}) => {
    const [apartments, setApartments] = useState<Apartment[]>([]);

    useEffect(() => {
        const loadApartments = async () => {
            try {
                const data = await apartmentService.getAllApartments();
                setApartments(data);
            } catch (error) {
                console.error('Error loading apartments:', error);
            }
        };
        loadApartments();
    }, []);

    const additionalFields = (
        <>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Căn hộ</InputLabel>
                    <Select
                        value={resident?.apartmentId || ''}
                        label="Căn hộ"
                        onChange={(e) => setResident({ ...resident!, apartmentId: e.target.value as number })}
                    >
                        {apartments.map((apt) => (
                            <MenuItem key={apt.id} value={apt.id}>
                                {apt.building} - {apt.number}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Stripe Customer ID"
                    value={resident?.stripeCustomerId || ''}
                    onChange={(e) => setResident({ ...resident!, stripeCustomerId: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Ngày bắt đầu"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={resident?.leaseStartDate || ''}
                    onChange={(e) => setResident({ ...resident!, leaseStartDate: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
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
        </>
    );

    return (
        <AddUserDialog
            open={open}
            resident={resident}
            setResident={setResident}
            onClose={onClose}
            onSave={onSave}
            dialogTitle="Thêm cư dân mới"
            additionalFields={additionalFields}
        />
    );
};

export default AddResidentDialog;