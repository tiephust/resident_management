export interface ApartmentDTO {
    id: number;
    name: string;
    description: string;
    apartmentOwnerId: number;
    feeIds: number[];
    residentIds: number[];
    deviceIds: number[];
    createdAt: string;
    updatedAt: string;
}

export interface NewApartmentDTO {
    name: string;
    description: string;
    apartmentOwnerId: number;
}

export interface Device {
    id: number;
    name: string;
    apartmentId: number;
    type: string;
    numberCard: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    maintenanceAt: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'BROKEN';
}