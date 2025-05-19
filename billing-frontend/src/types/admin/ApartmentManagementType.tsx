export interface Vehicle {
    id: number;
    type: 'Ô tô' | 'Xe máy';
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
}

export interface ParkingSlots {
    car: number;
    bike: number;
}

export interface ApartmentDetail {
    id: number;
    name: string;
    apartmentOwnerId: number;
    description: string | null;
    feeIds: number[];
    residentIds: number[];
    deviceIds: number[];
    createdAt: string | null;
    updatedAt: string | null;
    // Additional frontend-only fields
    building?: 'S1' | 'S2';
    floor?: number;
    ownerName?: string;
    vehicles?: Vehicle[];
    numResidents?: number;
    numKeys?: number;
    parkingSlots?: {
        car: number;
        bike: number;
    };
    notes?: string;
}

export interface NewApartment {
    name: string;
    apartmentOwnerId: number;
    description?: string | null;
    // Additional frontend-only fields
    building?: 'S1' | 'S2';
    floor?: number;
    ownerName?: string;
    numResidents?: number;
    numKeys?: number;
    parkingSlots?: {
        car: number;
        bike: number;
    };
    notes?: string;
}