// types/admin/DeviceManagementType.ts
export interface Apartment {
    id: number;
    name: string;
    description: string;
    apartmentOwnerId: number;
    feeIds: number[];
    residentIds: number[];
    deviceIds: number[];
    createdAt: string | null;  // Thêm | null
    updatedAt: string | null;  // Thêm | null
}

export interface Device {
    id: number;
    name: string;
    apartmentId?: number;
    apartment?: Apartment;
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
    apartments: Apartment[];
}