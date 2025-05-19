export interface ApartmentDTO {
    id: number;
    feeIds: number[];
    residentIds: number[];
    deviceIds: number[];
    name: string;
    apartmentOwnerId: number;
    description: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface NewApartmentDTO {
    name: string;
    apartmentOwnerId: number;
    description?: string | null;
}