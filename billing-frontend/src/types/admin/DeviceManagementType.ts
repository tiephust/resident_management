// types/admin/DeviceManagementType.ts
export interface Device {
    id: number;
    name: string;
    apartmentId?: number;
    type: string;
    numberCard?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    maintenanceAt: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'BROKEN';
}

export interface NewDevice {
    name: string;
    apartmentId?: number;
    type: string;
    numberCard?: string;
    description?: string;
    maintenanceAt: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'BROKEN';
}

export interface DeviceDialogProps {
    open: boolean;
    device: Device | NewDevice | null;
    setDevice: React.Dispatch<React.SetStateAction<Device | NewDevice | null>>;
    onClose: () => void;
    onSave: () => void;
}