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
    apartmentNumber: string;
    building: 'S1' | 'S2';
    floor: number;
    ownerName: string;
    vehicles: Vehicle[];
    numResidents: number;
    numKeys: number;
    parkingSlots: ParkingSlots;
    notes: string;
    apartmentOwnerId: number;
    deviceIds: number[];
}